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
<<<<<<< HEAD

//Mapping objects
=======
var qc = require('./QuickConnectNode.js' )
 
 //Mapping objects
>>>>>>> 338661184284d6c5f2366a9025a2f5e871086083
var validationMap = new Object()
var businessMap = new Object()
var viewMap = new Object()
var errorMap = new Object()


//Making the objects available to Node
exports.validationMap = validationMap
exports.businessMap = businessMap
exports.viewMap = viewMap
exports.errorMap = errorMap

//Mapping functions
function mapCommandToValCF(aCmd, aValCF) {
	//debug('mapCommandToValCF')
	var funcArray = validationMap[aCmd]
	if(funcArray == null) {
		funcArray = new Array()
		validationMap[aCmd] = funcArray
	}
	funcArray.push(aValCF)
}
exports.mapCommandToValCF = mapCommandToValCF

function mapCommandToBCF(aCmd, aBCF) {
	//debug('mapCommandToBCF')
<<<<<<< HEAD
	var funcArray = businessMap[aCmd]
=======
	if(aCmd == null || aDCF == null){
		return qc.missingCommandError
	}
	var funcArray = dataMap[aCmd]
>>>>>>> 338661184284d6c5f2366a9025a2f5e871086083
	if(funcArray == null) {
		funcArray = new Array()
		businessMap[aCmd] = funcArray
	}
	funcArray.push(aBCF)
}
<<<<<<< HEAD
exports.mapCommandToBCF = mapCommandToBCF//depricated
exports.mapCommandToDCF = mapCommandToBCF
=======
exports.mapCommandToBCF = function () {
	console.warn("WARNING: mapCommandToBCF is depricated. Use mapCommandToDCF instead")
	qc.mapCommandToDCF.apply(this,arguments)}//depricated
exports.mapCommandToDCF = qc.mapCommandToDCF
>>>>>>> 338661184284d6c5f2366a9025a2f5e871086083

function mapCommandToVCF(aCmd, aVCF) {
	//debug('mapCommandToVCF')
	var funcArray = viewMap[aCmd]
	if(funcArray == null) {
		funcArray = new Array()
		viewMap[aCmd] = funcArray
	}
	funcArray.push(aVCF)
}
exports.mapCommandToVCF = mapCommandToVCF


function mapCommandToECF(aCmd, aECF) {
	//debug('mapCommandToECF')
	var funcArray = errorMap[aCmd]
	if(funcArray == null) {
		funcArray = new Array()
		errorMap[aCmd] = funcArray
	}
	funcArray.push(aECF)
}
exports.mapCommandToECF = mapCommandToECF



