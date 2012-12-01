/********

 *********/
 
var qc = require('./QuickConnectNode.js')
var funcs = require('./functions.js')

var shouldPrint = true;
 
function allDone(){
	if(shouldPrint){
		console.log('we did it!: '+(funcs.finalTime - funcs.initialTime))
		shouldPrint = false;
	}
}
var commandArray = new Array()
for(var i = 0; i < 100; i++){
  //commandArray.push('example')
	commandArray.push('just run')
}
var parametersObject = {'initial':'hello', 'andra':'there', 'aNum':0}

//handleRequest API: qc.handleRequest(aCommandArray, requestData, allStacksCompleteCallback, runParallel)
//for(var i = 0; i < 10000; i++){
  qc.handleRequest(commandArray, parametersObject, allDone, true)
//}



