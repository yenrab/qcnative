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

 var inWebWorker = false
 try{
 	document
 }
 catch(err){
 	inWebWorker = true
 }

var DataAccess = new Object()
var databases = null

function getstackID(){
	var stackID = null
	var theCallingFunction = arguments.callee.caller
	var stackID = null
	while(!theCallingFunction.qc_stack_command){
		theCallingFunction =  theCallingFunction.caller
		if(!theCallingFunction){
			throw "The DataAccess transact method must be called from within a stack when executed from within a worker."
		}
	}
	stackID = theCallingFunction.qc_stack_parameters.stackID
	return stackID
}

DataAccess.initialize = function(dbName, dbSize){
	
	if(inWebWorker){
		self.postMessage({'custom':{'cmd':'initDb','params':{'dbName':dbName,'dbSize':dbSize, 'stackID':getstackID()}}})
	}
	else{
		if (!window.openDatabase) {
	        console.log('ERROR: Databases are not supported in this browser.')
	        return 'ERROR: Databases are not supported in this browser.'
	    }
		var aDb = new DataAccessObject(dbName, 1.0, 'some db', dbSize)
		databases[dbName] = aDb
	}
}

DataAccess.transact = function(responseId, dbName, SQL_or_Indicator, preparedStatementParameters){
	if(inWebWorker){
		self.postMessage({'custom':{'cmd':'transact','params':{'dbName':dbName,
				'sql':SQL_or_Indicator,'responseId':responseId,
				'preparedStatementParameters':preparedStatementParameters, 'stackID':getstackID()}}})
	}
	else{
		databases[dbName].transact(responseId, SQL_or_Indicator, preparedStatementParameters);
	}
}

if(!inWebWorker){
	databases = new Object()
	if(qc && qc.customFunctionMap){
		qc.customFunctionMap['initDb'] = function(parameters){
			var aDb = new DataAccessObject(parameters.dbName, 1.0, 'some db', parameters.dbSize)
			databases[dbName] = aDb
		}
		qc.customFunctionMap['transact'] = function(parameters){
			//console.log('transacting: '+parameters.stackID)
			databases[parameters.dbName].transact(parameters.responseId, parameters.sql
				, parameters.preparedStatementParameters, parameters.stackID)
		}
	}
	DataAccess.SYNC_NONE = 0;
	DataAccess.SYNC_ON_DEMAND = 1;
	DataAccess.SYNC_PERIODIC = 2;
	DataAccess.SYNC_CONTINUOUS = 3;

	/*
	 *  the sqlite database used in safari, Chrome, and some other browsers.
	 */

	function DataAccessObject(dbName, dbVersion, dbDescription, dbSize){
		//the default command sent as part of the URL
		this.syncType = 'sync';
	    
		this.dbName = dbName;
	    this.statementStore = new Object();
	    /*
	     *  this set of methods and attributes supports enterprise data synchronization
	     */
	    this.setupSyncing = function(aType, aURL, userName, password, timeoutSeconds, optionalPeriodSeconds){
	        this.transact("CREATE TABLE IF NOT EXISTS sync_info(last_sync TIMESTAMP);");
			this.transact("CREATE TABLE IF NOT EXISTS sync_temp(timeStamp TIMESTAMP, sql_key TEXT, sql_params TEXT)");
	        optionalPeriodSeconds *= 1000;
	        this.syncType = aType;
	        this.syncURL = aURL;
	        this.login  = [userName, password];
	        this.timeoutSeconds = timeoutSeconds;
	        var dbSelf = this;
	        if(DataAccess.SYNC_PERIODIC && optionalPeriodSeconds && !isNaN(optionalPeriodSeconds)){
				//debug('periodic syncing');
	            window.QCsyncRepeater = function(){
	                var params = [dbSelf];
	                handleRequest('QCsync',params);
	                setTimeout("QCsyncRepeater()", optionalPeriodSeconds);
	            }
	            setTimeout("QCsyncRepeater()", optionalPeriodSeconds);
	        }
	    }//end of stupSyncing
	    
	    //store key value pairs for later execution
	    this.storeStatement = function(key, statement){
	        this.statementStore[key] = statement;
	    }
	    
	    this.setStoredStatements = function(statementMap){
	        this.statementStore = satementMap;
	    }
	    
	    this.sync = function(lastSyncDate, dataToSync){
	        if(!this.currentlySyncing){
	            this.currentlySyncing = true;
	            var aSyncCall = new ServerAccessObject(this.syncURL, this.timeoutSeconds);
				//debug('syncing with: '+this.syncType+' '+this.login[0]+' '+this.login[1]+' '+lastSyncDate+' '+encodeURIComponent(JSON.stringify(dataToSync)));
	            aSyncCall.transact(ServerAccessObject.TEXT,null,'cmd='+this.syncType+'&uname='+this.login[0]
								  +'&pword='+this.login[1]
								  +'&lastSync='+lastSyncDate
								  +'&data='+encodeURIComponent(JSON.stringify(dataToSync)));
	        }
	    }
	    
	    /*
	     * end of sync methods
	     */
	    this.transact = function(responseId, SQL_or_Indicator, preparedStatementParameters, stackID){
	    	//console.log(responseId+' '+SQL_or_Indicator)
	        var lowerCaseSQL_or_Indicator = SQL_or_Indicator.toLowerCase();
	        var isChangingData = false
	        if(lowerCaseSQL_or_Indicator.indexOf('insert') == 0
	        	|| lowerCaseSQL_or_Indicator.indexOf('create') == 0){
	        	isChangingData = true;
	        }
	        /*
	         *  this may be a stored statement if an indicator was passed in
	         */
	        var storedSQL = this.statementStore[SQL_or_Indicator];
	        if(storedSQL){
	            var script = new DBScript(this);
	            script.addStatement(SQL_or_Indicator, preparedStatementParameters);
	            script.executetransactScript(responseId, stackID);
	        }
	        else{
	            this.dbAccess(responseId,SQL_or_Indicator, preparedStatementParameters, isChangingData, stackID);
	        }
	        
	    }
	    var dbSelf = this;
	    this.dbAccess = function(responseId, SQL, preparedStatementParameters, treatAsChangeData, stackID){
	    	var theSQL = SQL
	    	//console.log('trying: '+theSQL)
	        var theCallingFunction = arguments.callee.caller
			var stackCommand = null;
			var stackParameters = null;
	        if(!this.db){
	            this.db = openDatabase(dbName, dbVersion, dbDescription, dbSize);
	        }
	        var queryResult = new Object();
	        this.db.transaction(function(tx) {
	        					//console.log('about to try: '+theSQL)
	                            tx.executeSql(theSQL, preparedStatementParameters, function(tx, resultSet) {
		                                          //check to see if there was a sync key passed in instead of SQL
												  //debug('executed: '+theSQL);
												  if(treatAsChangeData){
												  		//console.log('executing '+theSQL)
			                                          try{
				                                          queryResult.insertedID = resultSet.insertId;
				                                          queryResult.rowsAffected = resultSet.rowsAffected;
			                                          }
			                                          catch(ex){
				                                          //then must have been an update
				                                          queryResult.rowsAffected = resultSet.rowsAffected;
			                                          }
												  }
												  else{//not a change to the database.  must be a query
													  queryResult.numRowsFetched = resultSet.rows.length;
													  var dataArray = new Array();
													  queryResult.numResultFields = 0;
													  queryResult.fieldNames = new Array();
													  if(queryResult.numRowsFetched > 0){
				                                          //retreive the field ids in the result set
				                                          var firstRecord = resultSet.rows.item(0);
				                                          var numFields = 0;
				                                          for(key in firstRecord){
					                                          var stuff = key;
					                                          queryResult.fieldNames.push(key);
					                                          numFields++;
				                                          }
				                                          queryResult.numResultFields = numFields;
				                                          var numRecords = queryResult.numRowsFetched;
				                                          for(var i = 0; i < numRecords; i++){
					                                          var record = resultSet.rows.item(i);
					                                          var row = new Array();
					                                          dataArray.push(row);
					                                          for(var j = 0; j < numFields; j++){
					                                          	row.push(record[queryResult.fieldNames[j]]);
					                                          }
				                                          }	
													  }
													  queryResult.records = dataArray;
												  }
	        								  	  /*
	        								  	   * resume the call stack if running in worker
	        								  	   */
	        								  	   if(stackID){
	        								  	   		//console.log('about to return to web worker')
	        								  	   		qc.continueStack(stackID, responseId, queryResult)
	        								  	   }
	        								  }//end of sql execute success callback function
	                                          , function(tx, error) {
	                                          		console.log('ERROR: '+JSON.stringify(error))
	        								  	  /*
	        								  	   * resume the call stack if running in worker
	        								  	   */
	                                          		if(stackID){
	        								  	   		qc.continueStack(stackID, responseId, {'error':error})
	        								  	   }
	                                          }//end of main sql execute fail callback function
	                                          );//end of main executeSql call
	                            });//end of transaction callback function
	    }
	    this.executeBatch = function(responseId, linker){
			if(!this.db){
	            this.db = openDatabase(dbName, dbVersion, dbDescription, dbSize);   
	        }
	        var dbSelf = this;
	        this.db.transaction(function(tx) {
									var keyCount = 0;
									for(key in linker){
		                            	keyCount++;
									}
		                            var params = null;
									var lastStatementIndex = keyCount;
									var numInserts = 0;
									for(var key in linker){
			                            var keyArray = JSON.parse(key);
			                            if(keyArray.length > 1){
			                            	params = keyArray[1];
			                            }
			                            else{
			                            	params = [];
			                            }
										var anSQL = linker[key];
										//debug('sql: '+anSQL);
										var errorHandled = false;
										tx.executeSql(anSQL,
													  params, 
													  function(tx, resultSet) {
														  numInserts++;
													  
													  },//end of sql execute success callback function
													  function(tx, error) {
														  //debug('function error: '+JSON.stringify(error));
														  var queryResult = new Object();
														  queryResult.errorMessage =  error.message;
														  if(theCallingFunction){
															  var stackParameters = theCallingFunction.qc_stack_parameters
															  stackParameters[responseId] = queryResult
												              /*
												               *  resume the call stack
												               */
												               theCallingFunction.qc_stack_parameters.thisRequestWorker.requestHandler(theCallingFunction.qc_stack_command, stackParameters);
			        								  	  }
														  errorHandled = true;
														  return true;
													  }//end of main sql execute fail callback function
													  );//end of main executeSql call
										
									}//end of for key in linker
									if(theCallingFunction){
									  	var stackParameters = theCallingFunction.qc_stack_parameters
									  	stackParameters[responseId] = queryResult
						              	/*
						               	*  resume the call stack
						               	*/
						               	theCallingFunction.qc_stack_parameters.thisRequestWorker.requestHandler(theCallingFunction.qc_stack_command, stackParameters);
							  		}
									}, 
								function(error){
	                            	debug('in transaction error: '+error.message);
	                            	return true;
	                            }//end of transaction error
							);//end of transaction callback function
		}
		
	}
}






