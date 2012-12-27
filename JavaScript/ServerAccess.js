/*
 Copyright (c) 2008, 2009, 2012 Lee Barney
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
 var ServerAccess = new Object()
/*
 * A representaion of the unititialized request state '0'.
 */
ServerAccess.UNITITIALIZED = 0
/*
 * A representaion of the setup but not sent request state '1'.
 */
ServerAccess.SETUP = 1
/*
 * A representaion of the sent but not having recieved request state '2'.
 */
ServerAccess.SENT = 2
/*
 * A representaion of the in process request state '3'.
 */
ServerAccess.IN_PROCESS = 3
/*
 * A representaion of the complete request state '4'.
 */
ServerAccess.COMPLETE = 4
/*
 * A representaion of the HTTP status code for file retrieval on OSX 'undefined'.  For other HTTP status codes go to www.w3.org/Protocols/rfc2616/rfc2616-sec10.html.
 */
ServerAccess.OSX_HTTP_File_Access = null
/*
 * A representaion of the HTTP status code for OK '200'.  For other HTTP status codes go to www.w3.org/Protocols/rfc2616/rfc2616-sec10.html.
 */
ServerAccess.HTTP_OK = 200
ServerAccess.HTTP_LOCAL = 0
/*
 * A representaion of the HTTP status code for Bad Request '400'.  For other HTTP status codes go to www.w3.org/Protocols/rfc2616/rfc2616-sec10.html.
 */
ServerAccess.HTTP_BADREQUEST = 400
/*
 * A representaion of the HTTP status code forVersion Not Supported '505'.  For other HTTP status codes go to www.w3.org/Protocols/rfc2616/rfc2616-sec10.html.
 */
ServerAccess.HTTP_VERSION_NOT_SUPPORTED = 505
/*
 * A representation of a data security check failure.
 */
ServerAccess.INSECURE_DATA_RECEIVED = -100
/*
 * The two legal values for the data retreival type
 */
ServerAccess.TEXT = 'Text'
ServerAccess.JSON = 'Text'
ServerAccess.HTML = 'Text'
ServerAccess.XML = 'XML'
/*
 * Indicators of if refresh is to be forced.
 */
ServerAccess.REFRESH = true
ServerAccess.NO_REFRESH = false

ServerAccess.transact = function(responseId, transactionType, URL, responseDataType, timeoutSeconds, refresh, parameterSequence, HTTPHeaders, data, contentType){
	console.log(URL)
	var timeout = 10000
    if(timeoutSeconds){
        timeout = timeoutSeconds*1000
    }
    var theCallingFunction = arguments.callee.caller
	var stackCommand = null;
	var stackParameters = null;
	while(!theCallingFunction.qc_stack_command){
		theCallingFunction =  theCallingFunction.caller
		if(!theCallingFunction){
			throw "The transact method of the ServerAccess must be called from within a stack."
		}
	}
	var actualRefresh = null
	var actualData = null
    if(transactionType.toLowerCase() == 'post' 
    	|| transactionType.toLowerCase() == 'put'){
        actualRefresh = true
    	actualData = data
    }
    else{
        actualRefresh = refresh
    }
    if(responseDataType != ServerAccess.XML){
		responseDataType = 'Text'
	}
	if(refresh == null){
		refresh = false
	}
	if(parameterSequence == null){
		parameterSequence = ''
	}
	else if(parameterSequence && !(this.URL.indexOf('?') == this.URL.length -1)){
		this.URL += '?'
	}
	if(data == null){
		data = ''
	}
    /*
	 * Get the request object to use
	 */
	try {
		var http = new XMLHttpRequest()
		var isAsynch = true//enforce asynchronous
		/*
		 *	open a connection to the server located at 'this.URL'.
		 */
		http.open(transactionType,URL+parameterSequence, isAsynch)
		if(refresh){
			/*
			 *  if we are to disable caching and force a call to the server, then the 'If-Modified-Since' header will 
			 *	need to be set to some time in the past.
			 */
			http.setRequestHeader( "If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT" )
		}
		//if there are headers then add them to the request
		if(HTTPHeaders != null){
			for(var key in HTTPHeaders){
				http.setRequestHeader(key,HTTPHeaders[key])
			}
		}
        //if data is to be sent, set the content type header so that the data encoding will be correctly interpreted by the server for decoding
        if(data != ''){
			if(contentType == null){
				http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded charset=UTF-8')
			}
			else{
				http.setRequestHeader('Content-Type', contentType)
			}
        }

        http.onload = function(){
        /*
		 *	Only handle completed, finished messages from the server
		 */
        if(http.status != 0 || http.aborted){
			clearTimeout(http.requestTimer);
			var stackParameters = theCallingFunction.qc_stack_parameters
            //the standard holder for all types of data queries
            var queryResult = new Object();
            //default errorMessage
            if(http.aborted){
                queryResult.errorNumber = -100;
                queryResult.errorMessage = "Request timed out.";
            }
            else if(http.status != ServerAccess.HTTP_OK 
                    && http.status != ServerAccess.HTTP_LOCAL
                    && http.status != ServerAccess.OSX_HTTP_File_Access){
                queryResult.errorNumber = http.status;
                queryResult.errorMessage = "Bad access type.";
            }
			/*
			 *  Retrieve the data if the server returns that the 
             *  processing of the request was successful or if
			 *  the request was directly for a file on the server disk.
			 *  Get it as either Text or XML
			 */
            if(queryResult.errorNumber == null){
				var unmodifiedData = http['response'+responseDataType];
				if(responseDataType != ServerAccess.XML){
					queryResult.results = unescape(unmodifiedData);
                    queryResult.data = queryResult.results;
				}
				else{
					queryResult.data = unmodifiedData;
				}
            }
            stackParameters[responseId] = queryResult
            /*
             *  resume the call stack
             */
             theCallingFunction.qc_stack_parameters.thisRequestWorker.requestHandler(theCallingFunction.qc_stack_command, stackParameters);
        }
		
    };
		/*
		 *	Send off the completed request and include any data for a 'POST' request.
		 */

		http.send(data)
		http.requestTimer = setTimeout(function() {
								   try{
									   http.abort();
									   http.aborted = true;
									   http.onload();
								   }
								   catch(err){
								   		console.log('ERROR: '+err);
								   }
								   
								   },timeout);
	
	} 
	catch(e) {
		console.log("ERROR: "+e)
		return false
	}
}