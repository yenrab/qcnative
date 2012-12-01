var mappings = require('./mappingUtil.js')
require('./mappings.js')
require('./functions.js')

<<<<<<< HEAD
var validationMap = mappings.validationMap//{}
var businessMap = mappings.businessMap//{}
var viewMap = mappings.viewMap//{}
var errorMap = mappings.errorMap//{}
=======
var validationMap = mappings.validationMap
var dataMap = mappings.dataMap
var viewMap = mappings.viewMap
var errorMap = mappings.errorMap
var groupMap = mappings.groupMap
>>>>>>> 338661184284d6c5f2366a9025a2f5e871086083

/*
 Copyright (c) 2012 AffinityAmp
 Created by Joshua Barney
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
qc = new Object()

qc.WAIT_FOR_DATA = 'wAiT'
qc.STACK_EXIT = 'ExIt_StAcK'
qc.STACK_CONTINUE = true
exports.WAIT_FOR_DATA = qc.WAIT_FOR_DATA
exports.STACK_EXIT = qc.STACK_EXIT
exports.STACK_CONTINUE = qc.STACK_CONTINUE

qc.executionMap = new Object()

qc.validationMapConsumables = new Object()
<<<<<<< HEAD
qc.businessMapConsumables = new Object()
=======
qc.dataMapConsumables = new Object()
>>>>>>> 338661184284d6c5f2366a9025a2f5e871086083
qc.viewMapConsumables = new Object()
qc.errorMapConsumables = new Object()

debug = console.log

/*! \fn qc.handleRequest(aCmd, requestParameters)
 @brief handleRequest(aCmd, requestParameters) <br/> The qc.handleRequest
  function is the trigger for the execution of mapped stacks.  Each 
  call to handleRequest is runs as much of the stack as possible on a 
  background worker thread.
 @param aCommand The <b>String</b> that uniquely identifies the stack of
  Control Functions you want executed.
 @param requestParameters An optional <b>Array</b> instance containing
  any and all values that you want passed to the indicated stack.
 */
qc.genrateUUID = function() {
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g
    , function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
  return uuid
}
function testImmediate(){
       var immediateExists = true
       try{
               setImmediate(function(){})
       } catch (e) {
               immediateExists = false
       }
       qc.nextTick = function (fn, prefereNextTick) {
               if (prefereNextTick || !immediateExists) {
                       process.nextTick(fn)
               } else {
                       setImmediate(fn)
               }
       }
exports.nextTick = qc.nextTick
}
testImmediate();

qc.doneWithRecursiveHandleRequest = function(){
    //debug("finished recursive handleRequest")
}

function handleRequestCallbackFunctionGenerator(aCommandArray, requestParameters
                , allStacksCompleteCallback) {
  //debug('generating handleRequestCallback: '+aCommandArray)
  if (aCommandArray.length > 0) {
    var aCmd = aCommandArray.shift()
    var uuid = qc.genrateUUID()
    qc.validationMapConsumables[uuid] = (validationMap[aCmd] || [] ).slice()
<<<<<<< HEAD
    qc.businessMapConsumables[uuid] = (businessMap[aCmd] || [] ).slice()
=======
    qc.dataMapConsumables[uuid] = (dataMap[aCmd] || [] ).slice()
>>>>>>> 338661184284d6c5f2366a9025a2f5e871086083
    qc.viewMapConsumables[uuid] = (viewMap[aCmd] || [] ).slice()
    qc.errorMapConsumables[uuid] = (errorMap[aCmd] || [] ).slice()
        //debug('consumable errors: '+JSON.stringify(qc.errorMapConsumables))
        //debug('returning requestHandler call')
    return function() {
            //debug('handleRequest callback'+aCommandArray)
            requestParameters = requestParameters || new Object()
      requestHandler(aCmd, requestParameters, uuid
                        , allStacksCompleteCallback, aCommandArray)
    }
  } else {
        if (allStacksCompleteCallback){
            //debug('calling External call back')
            qc.nextTick( allStacksCompleteCallback )
        }
    return qc.doneWithRecursiveHandleRequest
  }
}
<<<<<<< HEAD
=======
/*
*	commandParameterPairs is an array of {cmd:aCommand, parameters:{paramMap}, callback:aFunction} objects
*/
qc.handleBatchRequest = function(commandParameterPairsArray){
		if(Array.isArray(commandParameterPairsArray)){
			var numPairs = commandParameterPairsArray.length
			for(var i = 0; i < numPairs; i++){
				var aPair = commandParameterPairsArray[i]
				//all commands aer run parallel in a batch
				qc.handleRequest(aPair.cmd, aPair.parameters, aPair.callback, true)
			}
		}
}
exports.handleBatchRequest = qc.handleBatchRequest
>>>>>>> 338661184284d6c5f2366a9025a2f5e871086083

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
<<<<<<< HEAD
=======
//	var subCommands = groupMap[aCmd]
//	if(subCommands != null){
//		var numSubCommands = subCommands.length
//		for(var i = 0; i < numSubCommands; i++){
//			qc.handleRequest(subCommands[i], requestData, allStacksCompleteCallback, runParallel)
//		}
//		return;
//	}
>>>>>>> 338661184284d6c5f2366a9025a2f5e871086083
  //clone the array of commands
  aCommandArray = aCommandArray.slice()
    
  var uuid = qc.genrateUUID()
  var aCommand = cloneConsumableStacks(aCommandArray, uuid)
  if (!aCommand){
    console.warn('WARNING: attempting to execute the command "'
      + (aCommandArray[0] || 'missing')+'" for which no control functions are mapped.')
      return
  }
  requestData = requestData || new Object()
    
  if (runParallel){
    //debug('running parallel: '+aCommandArray)
    var numCommands = aCommandArray.length
    for (var i = 0; i < numCommands; i++){
      var aCmd = aCommandArray.shift()
      uuid = qc.genrateUUID()
      var aCmd = cloneConsumableStacks([aCmd], uuid)
      //debug('starting command '+aCmd)
      requestHandler(aCmd, requestData, uuid, allStacksCompleteCallback, [])
    }
    
  }
  else{
    //debug('calling request handler: '+aCommand+' '+uuid)
    //shift the first command off of the array so the stack 
    //will not be called for it twice.
    aCommandArray.shift()
    requestHandler(aCommand, requestData, uuid
                    , allStacksCompleteCallback, aCommandArray)
  }
}
exports.handleRequest = qc.handleRequest


function cloneConsumableStacks(aCommandArray, uuid){

  //var aCmd = aCommandArray.shift()
  //debug('cloning: ')
  var aCmd = aCommandArray[0]
  //debug("Command: "+aCmd)
  //if mappings are found then duplicate the mapped 
  //control function arrays for consumption
<<<<<<< HEAD
  if (!validationMap[aCmd] && !businessMap[aCmd] 
=======
  if (!validationMap[aCmd] && !dataMap[aCmd] 
>>>>>>> 338661184284d6c5f2366a9025a2f5e871086083
          && !viewMap[aCmd] && !errorMap[aCmd]) {
    //debug("returning null as the command")
    return
  }

  qc.validationMapConsumables[uuid] = (validationMap[aCmd] || [] ).slice()
<<<<<<< HEAD
  qc.businessMapConsumables[uuid] = (businessMap[aCmd] || [] ).slice()
=======
  qc.dataMapConsumables[uuid] = (dataMap[aCmd] || [] ).slice()
>>>>>>> 338661184284d6c5f2366a9025a2f5e871086083
  qc.viewMapConsumables[uuid] = (viewMap[aCmd] || [] ).slice()
  if (errorMap[aCmd]){
    qc.errorMapConsumables[uuid] = (errorMap[aCmd]).slice()
  }
  return aCmd
}

qc.handleBatchRequest = function(aRequestInfoArray) {
  if (!aRequestInfoArray || aRequestInfoArray.length == 0){
    console.warn('WARNING: attempting to execute a batch request without one or more command.')
  }
  var numCommandsInBatch = aRequestInfoArray.length
  for (var i = 0; i < numCommandsInBatch; i++){
    var requestInfo = aRequestInfoArray[i]
    if (!requestInfo.cmdArray || !requestInfo.data){
        console.warn('WARNING: Malformed request information "'
                +JSON.stringify(requestInfo)
                +'".  Request information must be an associative array with both "cmdArray" and "data" keys.')
    }
    qc.handleRequest(requestInfo['cmdArray'], requestInfo['data']
      , requestInfo['allStacksCompleteCallback'], requestInfo['runParallel'])
  }
}

exports.handleBatchRequest = qc.handleBatchRequest
/*! \fn qc.handleError(aCommand, errorParameters)
 @brief handleError(aCommand, errorParameters) <br/>The qc.handleError function is the trigger for the execution of mapped error handling stacks.  Each call to handleRequest is runs as much of the stack as possible on a background worker thread.
 @param aCommand The <b>NSString</b> that uniquely identifies the stack of Control Functions you want executed.
 @param errorParameters An optional <b>Array</b> instance containing any and all values that you want passed to the indicated stack.
 */
 
function ValCFCallback( result, aCmd, dataAccumulator
            , uuid, commandArray, allStacksCompleteCallback ){
  //debug('in ValCF callback: '+commandArray)
  if (result) {
    dispatchToValCF(aCmd, dataAccumulator, uuid
      , callbackFunctionSelector(commandArray, dataAccumulator
           , uuid, allStacksCompleteCallback)
      , commandArray, allStacksCompleteCallback)
  }
}
 
function BCFCallback( result, aCmd, dataAccumulator
              , uuid, commandArray, allStacksCompleteCallback ){
  //debug('in bcf callback: '+result)
  if (!result) {
    console.warn("WARNING: BCF returned false or null: " + aCmd)
    return
  }
  if (result == qc.WAIT_FOR_DATA) {
    //debug('waiting for data')
    return
  }
  var callback = callbackFunctionSelector(commandArray, dataAccumulator
                    , uuid, allStacksCompleteCallback )
    
  //debug('dispatching to bcf '+callback)
  dispatchToBCF(aCmd, dataAccumulator, uuid, callback
                 , commandArray, allStacksCompleteCallback)
}

function VCFCallback( result, aCmd, dataAccumulator
              , uuid, commandArray, allStacksCompleteCallback ){
  //debug('in VCFCallback: '+JSON.stringify(commandArray))
  if (result) {
    if (result == qc.WAIT_FOR_DATA || result == qc.STACK_EXIT) {
      //debug('done')
      return
    }
    dispatchToVCF(aCmd, dataAccumulator, uuid
          , callbackFunctionSelector(commandArray, dataAccumulator
                                      , uuid, allStacksCompleteCallback )
          , commandArray, allStacksCompleteCallback)
  } else {
    console.warn("WARNING: VCF returned false or null: " + aCmd)
    return
  }
}
 
function stackCompleteCallback( result, aCmd, dataAccumulator
                  , uuid, commandArray, allStacksCompleteCallback ){
    //debug("Done with stack for: " + aCmd+' current command array: '
    //+commandArray)
    qc.cleanStack(uuid)
    if (commandArray.length > 0){
        var callback = handleRequestCallbackFunctionGenerator(commandArray
                            , dataAccumulator, allStacksCompleteCallback)
        //debug('stack complete callback: '+callback)
        qc.nextTick(function(){callback() })
        return
    }
    if (allStacksCompleteCallback){
        //debug('all complete')
        qc.nextTick(allStacksCompleteCallback)
    }
}

function callbackFunctionSelector(aCommandArray, dataAccumulator
                , uuid, allStacksCompleteCallback ){
<<<<<<< HEAD
    //debug('selector: '+qc.businessMapConsumables[uuid])
=======
    //debug('selector: '+qc.dataMapConsumables[uuid])
>>>>>>> 338661184284d6c5f2366a9025a2f5e871086083
    if ( qc.validationMapConsumables[uuid] 
        && qc.validationMapConsumables[uuid].length > 0 ){
    //debug('selected val callback')
    return ValCFCallback
    
<<<<<<< HEAD
  } else if (qc.businessMapConsumables[uuid] 
            && (qc.businessMapConsumables[uuid].length > 0
=======
  } else if (qc.dataMapConsumables[uuid] 
            && (qc.dataMapConsumables[uuid].length > 0
>>>>>>> 338661184284d6c5f2366a9025a2f5e871086083
            || (qc.validationMapConsumables[uuid] 
                  && qc.validationMapConsumables[uuid].length == 1))){
    //debug('selected business callback')
        
    return BCFCallback
    
  } else if ( qc.viewMapConsumables[uuid] 
            && qc.viewMapConsumables[uuid].length > 0 ){
    //debug('selected  view callback: ')
        
    return VCFCallback
    
  } else {
    //debug('stack complete in callbackFunctionSelector')
    return stackCompleteCallback
  }

}

qc.handleError = function(aCmd, errorParameters) {
  var uuid = qc.genrateUUID()
    //debug('handling error '+aCmd)
    //debug('error map: '+JSON.stringify(qc.errorMapConsumables))
    aCmd = cloneConsumableStacks([aCmd], uuid)
    //debug('error map: '+JSON.stringify(qc.errorMapConsumables))
  dispatchToECF(aCmd, errorParameters, uuid
                , ECFCallbackFunctionGenerator(aCmd, errorParameters, uuid))
}
exports.handleError = qc.handleError

qc.cleanStack = function(uuid) {
  //debug('cleaning the stack')
  delete qc.executionMap[uuid]
  delete qc.validationMapConsumables[uuid]
<<<<<<< HEAD
  delete qc.businessMapConsumables[uuid]
=======
  delete qc.dataMapConsumables[uuid]
>>>>>>> 338661184284d6c5f2366a9025a2f5e871086083
  delete qc.viewMapConsumables[uuid]
  delete qc.errorMapConsumables[uuid]
}

qc.defaultECF = function(params) {
  console.error("ERROR: " + params)
}

function ECFCallbackFunctionGenerator(aCmd, dataAccumulator, uuid) {
  if ( qc.errorMapConsumables[uuid] 
      && qc.errorMapConsumables[uuid].length > 1 ) {
    return function(result) {
      dispatchToECF(aCmd, dataAccumulator, uuid
                  , ECFCallbackFunctionGenerator(aCmd, dataAccumulator, uuid))
    }
  }
    else if (!qc.errorMapConsumables[uuid]){
        console.error('ERROR: No Error Control Functions mapped to "'+aCmd+'".')
        return function() {}
    }
    else {
    return function() {
      //debug("Done with error stack: " + aCmd)
      qc.cleanStack(uuid)
    }
  }
}

function dispatchToECF(aCmd, dataAccumulator, uuid, callback) {
    //debug('dispatchToECF called: '+JSON.stringify(qc.errorMapConsumables))
  var functionsForCommand = qc.errorMapConsumables[ uuid ] || []
  var commandFunction = qc.defaultECF
  if (functionsForCommand.length > 0) {
    commandFunction = functionsForCommand.shift() || commandFunction
  }
    //debug('calling from dispatchToECF')
  qc.nextTick( function() { callback(commandFunction(dataAccumulator)) } )
}

function dispatchToVCF(aCmd, dataAccumulator, uuid
                       , callback, commandArray, allStacksCompleteCallback) {
  /*
  * Since this method is never called without passing a callback no check is 
  * needed to see if a callback was called.
  */
  if (!qc.viewMapConsumables[ uuid ]){
    stackCompleteCallback(result, aCmd, dataAccumulator, uuid
                , commandArray, allStacksCompleteCallback)
    return
  }
  var commandFunction = qc.viewMapConsumables[ uuid ].shift()
  try {
        
    if (commandFunction){
      var result = commandFunction(dataAccumulator, commandArray)
      if (qc.STACK_EXIT != result && qc.STACK_CONTINUE != result){
        console.error("ERROR: View control functions must return qc.STACK_CONTINUE or qc.STACK_EXIT. "
                      +result+" was returned instead. Exiting stack")
        qc.cleanStack(uuid)
        return
      }
      if (qc.STACK_EXIT == result 
           || qc.viewMapConsumables[uuid].length == 0){
        //debug('all vcfs complete: line 240')
        handleRequestCallbackFunctionGenerator(commandArray
                              , dataAccumulator, allStacksCompleteCallback)()
        return
      }
    }
    //debug('calling from dispatchToVCF: '+callback)
    qc.nextTick( function() {callback( result, aCmd, dataAccumulator
                        , uuid, commandArray, allStacksCompleteCallback )} )
  } catch(e) {
    var errorMessage = e.name 
    errorMessage += "\nmessage: " + e.message
    errorMessage += "\nstack: " + e.stack
    qc.handleError(aCmd, errorMessage, uuid)
    //debug('calling from VCF error')
    qc.nextTick( callback )
  }
}

function dispatchToBCF(aCmd, dataAccumulator, uuid
                          , callback, commandArray, allStacksCompleteCallback) {
<<<<<<< HEAD
  //debug('dispatching bcfs with: '+JSON.stringify(qc.businessMapConsumables[ uuid ]))
  if (!qc.businessMapConsumables[ uuid ] 
          || qc.businessMapConsumables[ uuid ].length == 0){
=======
  //debug('dispatching bcfs with: '+JSON.stringify(qc.dataMapConsumables[ uuid ]))
  if (!qc.dataMapConsumables[ uuid ] 
          || qc.dataMapConsumables[ uuid ].length == 0){
>>>>>>> 338661184284d6c5f2366a9025a2f5e871086083
    //debug('sending on to VCFs')
    dispatchToVCF(aCmd, dataAccumulator, uuid
                  , callbackFunctionSelector(commandArray, dataAccumulator, uuid
                                              , allStacksCompleteCallback)
                  , commandArray, allStacksCompleteCallback)
    return
  }
  /*
  * Since this method is never called without passing a callback no check is needed to see if a callback was called.
  */
<<<<<<< HEAD
  var commandFunction = qc.businessMapConsumables[ uuid ].shift()
=======
  var commandFunction = qc.dataMapConsumables[ uuid ].shift()
>>>>>>> 338661184284d6c5f2366a9025a2f5e871086083
  //debug('callback function is: '+callback.name)
  try {
    var result = commandFunction(dataAccumulator, uuid, commandArray
                                  , allStacksCompleteCallback)
    if (result == qc.WAIT_FOR_DATA) {
      qc.executionMap[uuid] = [aCmd, dataAccumulator]
    }
    else if (result == qc.STACK_EXIT){
      qc.cleanStack(uuid)
      return
    }
    else if (result != qc.STACK_CONTINUE){
      console.error("ERROR: Business control functions must return qc.STACK_CONTINUE, qc.STACK_EXIT, or qc.WAIT_FOR_DATA. "
                          +result+" was returned instead. Exiting stack")
      qc.cleanStack(uuid)
      return
    }
    //debug('calling from dispatchToBCF')
    qc.nextTick( function() {callback( result, aCmd, dataAccumulator, uuid
                                  , commandArray, allStacksCompleteCallback )})
  } catch(e) {
    var errorMessage = e.name 
    errorMessage += "\nmessage: " + e.message
    errorMessage += "\nstack: " + e.stack
    qc.handleError(aCmd, errorMessage, uuid)
    //debug('calling from BCF error')
    qc.nextTick( callback )
  }
}

function dispatchToValCF(aCmd, dataAccumulator, uuid, callback
                              , aCommandArray, allStacksCompleteCallback) {

  //debug('dispatchToValCF called: '+JSON.stringify(qc.viewMapConsumables))
  /*
  * Since this method is never called without passing a callback no check is needed to see if a callback was called.
  */
  try {
    var result = qc.STACK_CONTINUE
    if (qc.validationMapConsumables[ uuid ].length > 0){
      var commandFunction = qc.validationMapConsumables[ uuid ].shift()
      var result = commandFunction(dataAccumulator)
      if (result == qc.STACK_EXIT){
        qc.cleanStack(uuid)
        return
      }
      else if (result != qc.STACK_CONTINUE ){
        console.error("ERROR: Validation control functions must return qc.STACK_CONTINUE or qc.STACK_EXIT. "
                      +result+"was returned instead. Exiting stack.")
        qc.cleanStack(uuid)
        return
      }
    }
    //debug('about to process next tick: ')//+result+' '+aCommandArray+' '
    //        +aCmd+' '+callback)
    qc.nextTick( function() {callback( result, aCmd, dataAccumulator, uuid
                          , aCommandArray, allStacksCompleteCallback )})
  } catch(e) {
    var errorMessage = e.name 
    errorMessage += "\nmessage: " + e.message
    errorMessage += "\nstack: " + e.stack
    qc.handleError(aCmd, errorMessage, uuid)
    //debug('calling from dispatchToValCF error')
    qc.nextTick( callback )
  }
}



function requestHandler(aCmd, dataAccumulator, uuid
                          , allStacksCompleteCallback, aCommandArray) {
  //debug("in request handler for " + aCmd + ' '+uuid)
  if ( qc.validationMapConsumables[uuid].length > 0 ) {
    //debug('validating')
    dispatchToValCF(aCmd, dataAccumulator, uuid
                    , callbackFunctionSelector(aCommandArray, dataAccumulator
                                , uuid, allStacksCompleteCallback)
                    , aCommandArray, allStacksCompleteCallback)
<<<<<<< HEAD
  } else if ( qc.businessMapConsumables[uuid].length > 0 ) {
=======
  } else if ( qc.dataMapConsumables[uuid].length > 0 ) {
>>>>>>> 338661184284d6c5f2366a9025a2f5e871086083
    //debug('businessing')
    dispatchToBCF(aCmd, dataAccumulator, uuid
                  , callbackFunctionSelector(aCommandArray, dataAccumulator
                              , uuid, allStacksCompleteCallback)
                  , aCommandArray, allStacksCompleteCallback)
  } else if ( qc.viewMapConsumables[uuid].length > 0 ) {
    //debug('viewing: '+aCommandArray)
    dispatchToVCF(aCmd, dataAccumulator, uuid
                    , callbackFunctionSelector(aCommandArray, dataAccumulator
                                , uuid, allStacksCompleteCallback)
                    , aCommandArray, allStacksCompleteCallback)
  }
  else{
    console.warn('WARNING: attempting to execute the command "'
                  +aCmd+'" for which no control functions are mapped.') 
  }
}

function handleAsyncCompletion(uuid, resultKey, results, commandArray
                                  , allStacksCompleteCallback, error) {
  //debug('async completion: '+JSON.stringify(commandArray))
  //debug(qc.executionMap)
  //debug(uuid)
  var hold = qc.executionMap[uuid]
  var aCmd = hold[0]
  var dataAccumulator = hold[1]
  dataAccumulator[resultKey] = results
<<<<<<< HEAD
  if (error) {
    console.error("ERROR: attempting to complete stack but encountered error: '"
                  +error+"'.")
    return
  }
  if ( qc.businessMapConsumables[uuid].length > 0 ){
=======
  if ( qc.dataMapConsumables[uuid].length > 0 ){
>>>>>>> 338661184284d6c5f2366a9025a2f5e871086083
    dispatchToBCF(aCmd, dataAccumulator, uuid
                    , callbackFunctionSelector(commandArray, dataAccumulator
                                    , uuid, allStacksCompleteCallback)
                    , commandArray, allStacksCompleteCallback)
  } else if ( qc.viewMapConsumables[uuid].length > 0 ) {
    //debug('doing views from within async completion')
    dispatchToVCF(aCmd, dataAccumulator, uuid
                    , callbackFunctionSelector(commandArray, dataAccumulator
                                    , uuid, allStacksCompleteCallback)
                    , commandArray, allStacksCompleteCallback)
  }
}
qc.handleAsyncCompletion = handleAsyncCompletion

exports.handleAsyncCompletion = qc.handleAsyncCompletion
exports.qc = qc
