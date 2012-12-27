/*
 Copyright (c) 2008, 2009, 2011 Lee Barney
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

qc.WAIT_FOR_DATA = 'wAiT';
qc.STACK_EXIT = 'ExIt_StAcK';
qc.STACK_CONTINUE = 'ContInUe';

//remove white space from the beginning and end of a string
qc.trim = function(aString){
    return aString.replace(/^\s+|\s+$/g, '');
}

//replace all occurances of a string with another
qc.replaceAll = function(aString, replacedString, newSubString){
    while(aString.indexOf(replacedString) > -1){
        aString = aString.replace(replacedString, newSubString);
    }
    return aString;
}


/*! \fn qc.generateUUID()
 @brief qc.generateUUID() <br/> The qc.generateUUID function creates a universally unique identifier.
 @return a string that is universally unique.
 */

qc.genrateUUID = function(){
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                                                              var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                                                              return v.toString(16);
                                                              });
	return uuid;
}

//stop an event from doing its' default behavior

qc.stopDefault = function(event){
    if(event){
        event.preventDefault();
    }
    return false;
}

/*
 * These mapping functions require functions for the business rules,
 * view controls, error controls, and security controls NOT the names 
 * of these items as strings.
 */


qc.mapCommandToDCF = function(aCmd, aDCF){
    var funcArray = dataMap[aCmd];
	if(funcArray == null){
		funcArray = new Array();
		dataMap[aCmd] = funcArray;
	}
	funcArray.push(aDCF);
}

qc.mapCommandToVCF = function(aCmd, aVCF){
    var funcArray = viewMap[aCmd];
	if(funcArray == null){
		funcArray = new Array();
		viewMap[aCmd] = funcArray;
	}
	funcArray.push(aVCF);
}


qc.mapCommandToECF = function(anErrorCmd, anECF){
	var funcArray = errorMap[anErrorCmd];
	if(funcArray == null){
		funcArray = new Array();
		errorMap[anErrorCmd] = funcArray;
	}
	funcArray.push(anECF);
}

qc.mapCommandToValCF = function(aCmd, aValCF){
	var funcArray = validationMap[aCmd];
	if(funcArray == null){
		funcArray = new Array();
		validationMap[aCmd] = funcArray;
	}
	funcArray.push(aValCF);
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
    fnRE  = /function\s*([\w\-$]+)?\s*\(/i, stack = [],j=0, fn,args,i;
                                        
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
