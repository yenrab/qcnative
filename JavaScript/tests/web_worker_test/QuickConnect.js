/*
 Copyright (c) 2008, 2009, 2011, 2012 Lee Barney
 Permission is hereby granted, free of charge, to any person obtaining a 
 copy of this software and associated documentation files (the "Software"), 
 to deal in the Software without restriction, including without limitation the 
 rights to use, copy, modify, merge, publish, distribute, sublicense, 
 and/or sell copies of the Software, and to permit persons to whom the Software 
 is furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be 
 included in all copies or substantial portions of the Software.
 
 
 
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
 PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
 CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
 OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 
 
 */

var qc = new Object();

qc.WAIT_FOR_DATA = 'wAiT';
qc.STACK_EXIT = 'ExIt_StAcK';
qc.STACK_CONTINUE = 'ContInUe';
 
var validationMap = new Object()
var dataMap = new Object()
var viewMap = new Object()
var errorMap = new Object()
var groupMap = new Object()

qc.validationMapConsumables = new Object()
qc.dataMapConsumables = new Object()
qc.viewMapConsumables = new Object()


qc.missingCommandError = 0
qc.success = 1

qc.workerThreadMap = new Object()
qc.customFunctionMap = new Object()

function debug(aMessage){
  console.log(aMessage)
}

 //generate a UUID
qc.generateUUID = function(){
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                                                              var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                                                              return v.toString(16);
                                                              })
    return uuid
}

qc.RequestHandlerPool = function(min_size) {
    var workerQueue = [];
    var workingThreads = {}
    for (var i = 0 ; i < min_size ; i++) {
        workerQueue.push(new qc.HandlerThread(this))
    }
    this.executeHandleRequestTask = function(handleRequestData, continuationFunction) {
        var workerThread = null;
        if (workerQueue.length > 0) {
            // get the worker from the front of the queue
            workerThread = workerQueue.shift()
            //console.log('getting worker: '+workerThread)
        } else {
            // no free workers, create a new one
            workerThread = new qc.HandlerThread()
            //console.log('created worker: '+workerThread)
        }
        workingThreads[workerThread.uuid] = workerThread
        workerThread.run(handleRequestData, continuationFunction);
    }
    this.reuseWorkerThread = function(aWorkerThread){
      delete workingThreads[aWorkerThread.uuid]
      workerQueue.push(aWorkerThread)
    }
    this.freeUnusedHandlerThreads = function(){
      var currentTime = new Date().getTime()
      while(workerQueue.length > min_size && currentTime - workerQueue[0].usedTime > 30000){
        workerQueue.shift()
      }
    }
}

function clearOldHandlerThreads(){
  requestPool.freeUnusedHandlerThreads();
}

setInterval(clearOldHandlerThreads, 60000);

qc.HandlerThread = function() {
    var self = this
    this.theWorker = null
    this.requestData = null
    this.run = function(handleRequestData, continuationFunction) {
        if(!this.theWorker){
          this.workerFileName = 'RequestWorker.js'
          if(handleRequestData.data.workerFileName){
            this.workerFileName = handleRequestData.data.workerFileName
          }
          this.theWorker = new Worker(this.workerFileName)
        }
        this.requestData = handleRequestData
        var uuid = qc.generateUUID()
        handleRequestData.data.stackID = uuid
        qc.workerThreadMap[uuid] = this
        // create a new web worker
        this.theWorker.continuationFunction = continuationFunction;
        this.theWorker.onmessage = function(event) {
            //call back from worker
            var results = event.data
            if(results.constructor == String){
              results = JSON.parse(results)
            }
            if(results.stackFlag == qc.STACK_CONTINUE){
                //free the thread early so the it is available before view code runs
                requestPool.reuseWorkerThread(self)
                var result = qc.dispatchToVCF(results.cmd, results.data)
                if(this.continuationFunction){
                  this.continuationFunction(results.data)
                }
                else if(this.continuationFunction){
                  window[this.continuationFunction](results.data)
                }
            }
            else if(results.stackFlag == qc.STACK_EXIT){
                requestPool.reuseWorkerThread(self)
            }
            else if(results.log){
              console.log(results.log)
            }
            else if(results.custom){
              var customCallData = results.custom
              qc.customFunctionMap[customCallData.cmd](customCallData.params)
            }
            else if(results.startStack){
              var allStacksCompleteCallbackFunc = eval(results.allStacksCompleteCallback)
              qc.handleRequest(results.aCommandArray, results.requestData, allStacksCompleteCallbackFunc, results.runParallel)
            }
            else if(results.err){
              console.error(results.err)
            }
            else if(results.warn){
              console.warn(results.warn)
            }
            else if(results.alert){
              alert(results.alert)
            }
            else{
              console.log('Error: unknown push to main page thread.')
            }
        }
        //console.log('posting to worker: ')
        this.theWorker.postMessage(JSON.stringify(handleRequestData))
    }
}


qc.continueStack = function(stackID, responseID, responseData){
  var theThread = qc.workerThreadMap[stackID]
  theThread.requestData.data[responseID] = responseData
  theThread.requestData.data['continue'] = true
  theThread.theWorker.postMessage(JSON.stringify(theThread.requestData))
}

var requestPool = new qc.RequestHandlerPool(1)

qc.handleRequest = function(aCommandArray, requestData
                    , allStacksCompleteCallback, runParallel) {
  if (!aCommandArray || aCommandArray.length == 0){
    console.warn('WARNING: attempting to execute a request without one or more commands.')
  }
  if (Array.isArray(requestData)){
    requestData = {'paramArray':requestData}
  }
  if (!Array.isArray(aCommandArray)) {
    aCommandArray = [aCommandArray]
  }
  requestData = requestData || new Object()
  var calledFromWithinStack = false;
  if(requestData.stackID){
    delete requestData['stackID']
    calledFromWithinStack = true;
  }/*
  if(!calledFromWithinStack){
    var aFunc = arguments.callee.caller
    while(aFunc){
      if(aFunc.qc_stack_command){
        calledFromWithinStack = true
        break
      }
      aFunc = arguments.callee.caller
    }
  }*/
  if(calledFromWithinStack){
    delete requestData['thisRequestWorker']
    var postData = {'startStack':true, 'aCommandArray':aCommandArray,
              'requestData':requestData,
              'runParallel':runParallel}
    theWorker.postMessage(JSON.stringify(postData))
    return;
  }
  if (runParallel){
    var numCommands = aCommandArray.length
    for (var i = 0; i < numCommands; i++){
      var aCmd = aCommandArray.shift()
      var subCommands = groupMap[aCmd]
      if(subCommands != null){
          var numSubCommands = subCommands.length
          qc.handleRequest(subCommands.slice(), requestData, allStacksCompleteCallback, runParallel)
          return;
      }
      requestPool.executeHandleRequestTask({'cmd':aCmd, 'data':requestData}, allStacksCompleteCallback)
    }
  }
  else{
    function executeNextCommand(){
      var aCommand = aCommandArray.shift()
      requestPool.executeHandleRequestTask({'cmd':aCommand, 'data':requestData},
          aCommandArray.length > 1 ? executeNextCommand : allStacksCompleteCallback)
    }
      //shift the first command off of the array so the stack 
      //will not be called for it twice.
      var aCommand = aCommandArray.shift()
      var subCommands = groupMap[aCommand]
      if(subCommands != null){
          var numSubCommands = subCommands.length
          for(var i = 0; i < numSubCommands; i++){
              qc.handleRequest(subCommands, requestData, allStacksCompleteCallback, runParallel)
          }
          return;
      }
      requestPool.executeHandleRequestTask({'cmd':aCommand, 'data':requestData},
              aCommandArray.length > 0 ? executeNextCommand : allStacksCompleteCallback)
  }
}

qc.handleBatchRequest = function(requestDefinitions){
  var numPairs = arguments.length
  for(var i = 0; i < numPairs; i++){
    var aDefinition = arguments[i]
    //all commands are run parallel in a batch
    qc.handleRequest(aDefinition.cmd, aDefinition.parameters, aDefinition.callback, true)
  }
}

qc.cloneConsumableStacks = function(aCmd, uuid){
  //console.log('------------------in cloning: '+aCmd+"---------------------------")
  //if mappings are found then duplicate the mapped 
  //control function arrays for consumption

  if (!validationMap[aCmd] && !dataMap[aCmd] 
          && !viewMap[aCmd] && !errorMap[aCmd]) {
    //console.log('no stacks found')
    return
  }
  qc.validationMapConsumables[uuid] = (validationMap[aCmd] || [] ).slice()
  qc.dataMapConsumables[uuid] = (dataMap[aCmd] || [] ).slice()
  if (errorMap[aCmd]){
    qc.errorMapConsumables[uuid] = (errorMap[aCmd]).slice()
  }
  return true
}
qc.handleError = function(aCommandArray, requestData
                    , runParallel){
  qc.handleRequest(aCommandArray, requestData
                    , null, runParallel)
}

/*  
* The dispatchToValCF function is responsible for executing
* any validation functions associated with a specific command.
*/
qc.dispatchToValCF = function(command, parameters){
  return qc.dispatchToCF(command, parameters, qc.validationMapConsumables)
}
/*  
* The dispatchToDCF function is responsible for executing
* any validation functions associated with a specific command.
*/
qc.dispatchToDCF = function(command, parameters){
    //console.log('doing dcfs: '+parameters.stackID)
    return qc.dispatchToCF(command, parameters, qc.dataMapConsumables)
}
/*  
* The dispatchToValCF function is responsible for executing
* any validation functions associated with a specific command.
* The stack is cloned here since it will run in the main thread/page.
*/
qc.dispatchToVCF = function(command, parameters){
  //console.log('validation id:'+parameters.stackID)
  qc.viewMapConsumables[parameters.stackID] = (viewMap[command] || [] ).slice()
  return qc.dispatchToCF(command, parameters, qc.viewMapConsumables)
}
qc.dispatchToCF = function(command, parameters, map){
	var commandFuncs = map[parameters.stackID];
	if(commandFuncs){
		var numFuncs = commandFuncs.length;
		for(var i = 0; i < numFuncs; i++){
      var theControlFunc = commandFuncs.shift()
      theControlFunc.qc_stack_command = command
      theControlFunc.qc_stack_parameters = parameters
			var retVal = theControlFunc(parameters)
			if(retVal == qc.STACK_EXIT){
				return qc.STACK_EXIT
			}
      else if(retVal == qc.STACK_WAIT){
        return qc.STACK_WAIT
      }
		}
	}
	return qc.STACK_CONTINUE;
}

/*
 * These mapping functions require functions for the business rules,
 * view controls, error controls, and security controls NOT the names 
 * of these items as strings.
 */


qc.mapCommandToDCF = function(aCmd, aDCF){
    var funcArray = dataMap[aCmd]
    if(funcArray == null){
        funcArray = new Array()
        dataMap[aCmd] = funcArray
    }
    funcArray.push(aDCF)
}

qc.mapCommandToVCF = function(aCmd, aVCF){
    var funcArray = viewMap[aCmd]
    if(funcArray == null){
        funcArray = new Array()
        viewMap[aCmd] = funcArray
    }
    funcArray.push(aVCF)
}


qc.mapCommandToECF = function(anErrorCmd, anECF){
    var funcArray = errorMap[anErrorCmd]
    if(funcArray == null){
        funcArray = new Array()
        errorMap[anErrorCmd] = funcArray
    }
    funcArray.push(anECF)
}

qc.mapCommandToValCF = function(aCmd, aValCF){
    var funcArray = validationMap[aCmd]
    if(funcArray == null){
        funcArray = new Array()
        validationMap[aCmd] = funcArray
    }
    funcArray.push(aValCF)
}

/*
* this method has a first parameter that is the new command
* and an array of commands that are subcommands to be
* associated under the parent command
*/

qc.mapCommandToSubCommands = function(command, subCommands){
  if(!command || arguments.length < 2){
    return qc.missingCommandError
  }
  var numArgs = arguments.length
  for(var i = 1; i < numArgs; i++){
    var success = qc.addSubCommand(command, arguments[i])
    if(success == qc.missingCommandError){
      groupMap[command] = null
      return qc.missingCommandError
    }
  }
}

qc.addSubCommand = function(aCommand, aSubCommand){
    if(aCommand == null || aSubCommand == null){
      return qc.missingCommandError
    }
    var subCommandSubs = groupMap[aSubCommand]
    if(subCommandSubs){
      var numSubSubs = subCommandSubs.length
      for(var i = 0; i < numSubSubs; i++){
        qc.addSubCommand(aCommand, subCommandSubs[i])
      }
    }
    else{
      var aGroup = groupMap[aCommand]
      if(!aGroup){
        aGroup = new Array()
        groupMap[aCommand] = aGroup
      }
      aGroup.push(aSubCommand)
    }
    return qc.success;
}

//remove white space from the beginning and end of a string
qc.trim = function(aString){
    return aString.replace(/^\s+|\s+$/g, '')
}

//replace all occurances of a string with another
qc.replaceAll = function(aString, replacedString, newSubString){
    while(aString.indexOf(replacedString) > -1){
        aString = aString.replace(replacedString, newSubString)
    }
    return aString
}

//stop an event from doing its' default behavior
qc.stopDefault = function(event){
    if(event){
        event.preventDefault()
    }
    return false
}

/*
 * errorMessage creates a single string message
 * from all of the data available from an error
 * created by a try/catch statement.  If it is 
 * passed something other than an error it 
 * treats it like a string.
 */
qc.errorMessage = function(err){
    var errMsg = 'ERROR: ';
    if(err.name && err.message && err.line && err.sourceURL){
        var fileName = err.sourceURL;
        var stringArr = fileName.split('/');
        var fileName = stringArr[stringArr.length -1];
        errMsg += err.name+': '+err.message+' '+fileName+' line: '+err.line;
    }
    else{
        errMsg += err;
    }
    var curr  = arguments.callee.caller,
    FUNC  = 'function', ANON = "{anonymous}",
    fnRE  = /function\s*([\w\-$]+)?\s*\(/i, stack = [],j=0, fn,args,i
                                        
    errMsg += '\ncall stack:\n';
    while (curr) {
        var fn    = fnRE.test(curr.toString()) ? RegExp.$1 || ANON : ANON;
        var args  = stack.slice.call(curr.arguments);
        var i     = args.length;
        
        while (i--) {
           switch (typeof args[i]) {
                case 'string'  : args[i] = '"'+args[i].replace(/"/g,'\\"')+'"';
                        break;
                case 'function': args[i] = FUNC; 
                        break;
            }
        }
       if(fn != 'logError'){
           errMsg += fn + '(' + args.join() + ')';
       }
        errMsg+="\n";
        curr = curr.caller;
    }
   return errMsg;
}
