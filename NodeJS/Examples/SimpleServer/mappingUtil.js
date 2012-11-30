/*
 Copyright (c) 2012 Lee Barney
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
var qc = require('./QuickConnectNode.js' )
 
 //Mapping objects
var validationMap = new Object()
var dataMap = new Object()
var viewMap = new Object()
var errorMap = new Object()
var groupMap = new Object()


//Making the objects available to Node
exports.validationMap = validationMap
exports.dataMap = dataMap
exports.viewMap = viewMap
exports.errorMap = errorMap
exports.groupMap = groupMap

qc.missingCommandError = 0
exports.missingCommandError = qc.missingCommandError
qc.success = 1
exports.success = qc.success

//Mapping functions
qc.mapCommandToValCF = function(aCmd, aValCF) {
	//debug('mapCommandToValCF')
	if(aCmd == null || aValCF == null){
		return qc.missingCommandError
	}
	var funcArray = validationMap[aCmd]
	if(funcArray == null) {
		funcArray = new Array()
		validationMap[aCmd] = funcArray
	}
	funcArray.push(aValCF)
}
exports.mapCommandToValCF = qc.mapCommandToValCF

qc.mapCommandToDCF = function(aCmd, aDCF) {
	//debug('mapCommandToBCF')
	if(aCmd == null || aDCF == null){
		return qc.missingCommandError
	}
	var funcArray = dataMap[aCmd]
	if(funcArray == null) {
		funcArray = new Array()
		dataMap[aCmd] = funcArray
	}
	funcArray.push(aDCF)
}
exports.mapCommandToBCF = function () {
	console.warn("WARNING: mapCommandToBCF is depricated. Use mapCommandToDCF instead")
	qc.mapCommandToDCF.apply(this,arguments)}//depricated
exports.mapCommandToDCF = qc.mapCommandToDCF

qc.mapCommandToVCF = function(aCmd, aVCF) {
	//debug('mapCommandToVCF')
	if(aCmd == null || aVCF == null){
		return qc.missingCommandError
	}
	var funcArray = viewMap[aCmd]
	if(funcArray == null) {
		funcArray = new Array()
		viewMap[aCmd] = funcArray
	}
	funcArray.push(aVCF)
}
exports.mapCommandToVCF = qc.mapCommandToVCF


qc.mapCommandToECF = function (aCmd, aECF) {
	//debug('mapCommandToECF')
	if(aCmd == null || aECF == null){
		return qc.missingCommandError
	}
	var funcArray = errorMap[aCmd]
	if(funcArray == null) {
		funcArray = new Array()
		errorMap[aCmd] = funcArray
	}
	funcArray.push(aECF)
}
exports.mapCommandToECF = qc.mapCommandToECF

/*
*	this method has a first parameter that is the new command
*	and an array of commands that are subcommands to be
*	associated under the parent command
*/

qc.mapCommandToSubCommands = function(command, subCommandArray){
	if(!command || !subCommandArray){
		return qc.missingCommandError
	}
	if(!subCommandArray instanceof Array){
		subCommandArray = [subCommandArray]
	}
	var numCommands = subCommandArray.length
	for(var i = 0; i < numCommands; i++){
		var success = qc.addSubCommand(command, arguments[i])
		if(success == qc.missingCommandError){
			groupMap[parentCommand] = null
			return success
		}
	}
}
exports.mapCommandToSubCommands = qc.mapCommandToSubCommands

qc.addSubCommand = function(aCommand, aSubCommand){
		if(aCommand == null || aSubCommand == null){
			return qc.missingCommandError
		}
		var subCommands = groupMap[aCommand]
		if(!subCommands){
			subCommands = new Array()
			groupMap[aCommand] = subCommands
		}
		subCommand.push(aSubCommand)
		return qc.success;
}