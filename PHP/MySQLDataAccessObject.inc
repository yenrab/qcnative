<?php /* 
 Copyright (c) 2007, 2008, 2009 Lee Barney
 Permission is hereby granted, free of charge, to any person obtaining a 
 copy of this software and associated documentation files (the "Software"), 
 to deal in the Software without restriction, including without limitation the 
 rights to use, copy, modify, merge, publish, distribute, sublicense, 
 and/or sell copies of the Software, and to permit persons to whom the Software 
 is furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be 
 included in all copies or substantial portions of the Software.
 
 The end-user documentation included with the redistribution, if any, must 
 include the following acknowledgment: 
 "This product was created using the QuickConnect framework.  http://quickconnect.sourceforge.net/", 
 in the same place and form as other third-party acknowledgments.   Alternately, this acknowledgment 
 may appear in the software itself, in the same form and location as other 
 such third-party acknowledgments.
 
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
 PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
 CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
 OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


 */ ?>
<?php
/*
*  This class is designed to hide the messy bits of database interaction 
* and to be a module that allows any SQL to be used.  This SQL can be 
* a standard SQL string or use prepared statements.  Its' public methods use the facade
* pattern.
* 
* If a standard SQL string is used, and parameters are being passed, it is the responsibility 
* of the calling function to secure the parameters via the use of add_slashes or some other 
* similar functionallity.
* 
*  
* The writer of the code that calls this library is responsible for escaping all input used in
* standard SQL calls.  For greater security use prepared statements 
* for most all SQL execution instead.
*/
class MySQLDataAccessObject{
	//attributes available only within class methods
	private $statement;
	private $userName;
	private $password;
	private $dbURL;
	private $schemaName;
	
	//attributes available via accessor methods
	private $errorNumber;
	private $errorMessage;
	private $numRowsFetched;
	private $insertedID;
	private $numResultFields;
	private $fields;
	
	/*
	 * A constructor that sets the connection information for the 
	 * database.
	 */
	public function __construct($userName, $password, $dbURL, $schemaName){
		//database connection information
		$this->userName = $userName;
		$this->password = $password;
		$this->dbURL = $dbURL;
		$this->schemaName = $schemaName;
		$this->questionMarkAscii = 63;
		/* 
		 * Get a connection to the database.
		 * If this is the first attempt to call 
		 * the database within this script this will create
		 * a connection.  If a connection has been made 
		 * within this script previously the connection 
		 * will be reused.
		 */
		$this->conn = new mysqli($this->dbURL, $this->userName, $this->password, $this->schemaName);
		if(!$this->conn){
			$this->errorNumber = mysqli_errno();
			$this->errorMessage = mysqli_error();
		}
	}
	/*
	 * accessors
	 */
	/*
	 * This method returns an error number if an error 
	 * happened in the last get or set
	 */
	public function getErrorNumber(){
		return $this->errorNumber;
	}
	/*
	 * This method returns an error message 
	 * if an error happened in the last get or set 
	 */
	public function getErrorMessage(){
		return $this->errorMessage;
	}
	/*
	 * This method returns the number of rows 
	 * returned by a select
	 */
	public function getNumRowsFetched(){
		return $this->numRowsFetched;
	}
	/*
	 * This method returns the auto-generated
	 * id if one was generated
	 */
	public function getInsertedID(){
		return $this->insertedID;
	}
	/*
	 * This method returns a count of the field names
	 */
	public function getNumResultFields(){
		return $this->$numResultFields;
	}
	/*
	 * This method returns a map where the key is 
	 * the field name and the value is the column number
	 */
	public function getFieldNames(){
		return $this->fields;
	}
	/*
	 * Initialize transaction processing
	 */
	public function startTransaction(){
		$this->conn->autocommit(FALSE);
	}

	/*
	 * commit the changes made in the transaction to the database
	 */
	public function commitTransaction(){
		$this->conn->commit();
	}
	/*
	 * undo the changes made in the transaction
	 */
	public function rollBackTransaction(){
		$this->conn->rollback();
	}
	/*
	 * close the connection
	 */
	public function done(){
		$this->conn->close();
	}
	/*
	 * $proceedureName is the name of the stored proceedure
	 * $fieldValueArray is a two dimensional array used 
	 * if prepared statements are being used.  Each element 
	 * in the first dimension consists of an array of two elements.  
	 * The first is the data type for the bind variable, the second 
	 * is the value that is to be bound.
	 */
	public function callStoredProceedure($proceedureName, $fieldValueArray){
		
		if($this->conn){
			/*
			 * generate the sql for the stored proceedure
			 */
			$sql = "call ".$proceedureName."(";
			$numParams = sizeof($fieldValueArray);
			for($i = 0; $i < $numParams; $i++){
				$sql .= "?";
				if($i < $numParams -1){
					$sql .= ", ";
				}
			}
			$sql .= ")";
			return $this->dbAccess($sql, $fieldValueArray, false);
    	}
    	return false;
	}
	/*
	 * $sql is the SQL string to execute
	 * $fieldValueArray is a two dimensional array used 
	 * if prepared statements are being used.  Each element 
	 * in the first dimension consists of an array of two elements.  
	 * The first is the data type for the bind variable, the second 
	 * is the value that is to be bound.
	 * 
	 * Returns the number of records affected if any for successful INSERT, etc. 
	 * Returns false on failure.
	 */
    public function setData($sql, $fieldValueArray){
    	if($this->conn){
			return $this->dbAccess($sql, $fieldValueArray, true);
    	}
    	return false;
    }
	
	/*
	 * $sql is the SQL string to execute
	 * $fieldValueArray is a two dimensional array used 
	 * if prepared statements are being used.  Each element 
	 * in the first dimension consists of an array of two elements.  
	 * The first is the data type for the bind variable, the second 
	 * is the value that is to be bound.
	 * 
	 * Returns an array of data on success, false on failure
	 */
    public function getData($sql, $fieldValueArray){
    	if($this->conn){
			return $this->dbAccess($sql, $fieldValueArray, false);
    	}
    	return false;
    }
	/*
	 * $sql is the SQL string to execute
	 * $fieldValueArray is a two dimensional array used 
	 * if prepared statements are being used.  Each element 
	 * in the first dimension consists of an array of two elements.  
	 * The first is the data type for the bind variable, the second 
	 * is the value that is to be bound.
	 * The third parameter is a flag indicating if the sql type is 
	 * some sort of update to the database
	 * 
	 * Returns false on failure, an array of data for a successful 
	 * get type request, for update type requests the number of records 
	 * affected is returned if any.
	 */
    private function dbAccess($sql, $fieldValueArray, $treatAsChangeData)
	{
		$this->errorNumber = null;
		$this->errorMessage = null;
		/*
		 * set result defalut value to failure flag
		 */	
		$result = false;
		/*
		 * Validate that the inputs match appropriately
		 */
		if($sql == null){
			$this->errorNumber = -1200;
			$this->errorMessage = "No SQL passed";
		}
		$numFields = 0;
		//set the number of fields if a field value array was 
		//passed in as a parameter.
		if($fieldValueArray){
			$numFields = count($fieldValueArray);
		}
		//get a map of the characters and how many times
		//each of them appears in the SQL string.
		$charCountArray = count_chars($sql, 0);
		$numSQLFields = $charCountArray[$this->questionMarkAscii];
		//the number of question marks in the query must match the number 
		//of fields in the field value array or the programmer has made 
		//an error.
		if(!$this->errorNumber && $numFields != $numSQLFields){
			$this->errorNumber = -1201;
			$this->errorMessage = "The number of field values passed for use in the prepared statement do not match the number of variables in the SQL";
		}
		//Handle errors when the parameter type or datavalue is null 
		if(!$this->errorNumber && $numFields > 0) {
			for ($i = 0; $i < $numFields; $i++)
			{
				/* Uncomment this if statement if you don't want to allow null or 0 (zero) to be passed in
				if (!$fieldValueArray[$i][1]){
					$this->errorNumber = -1202;
					$this->errorMessage = "Parameter $i's value is null";
					break;
				}
				*/
				if (!$fieldValueArray[$i][0]){
					$this->errorNumber = -1203;
					$this->errorMessage = "Parameter $fieldValueArray[$i]'s type is null";
					break;
				}
			}
		}
		/*
		 * if there has been no error, process the SQL
		 */
		if(!$this->errorNumber){
			if($numFields > 0){
				if(!($this->statement = $this->conn->prepare($sql))){
						$this->errorNumber = $this->conn->errno;
						$this->errorMessage = $this->conn->error;
				}
				else{
					$bindInfo[0] = &$this->statement;
					$bindTypes = '';
					$bindInfo[1] = &$bindTypes;
					for($i = 0; $i < $numFields; $i++){
						$bindTypes .= $fieldValueArray[$i][0];
						$bindInfo[$i+2] = &$fieldValueArray[$i][1];
					}
					//remove this after debugging
					ob_start();
					print_r($bindInfo);
					$szLog = ob_get_clean();
					error_log($szLog);  
					
					if(!call_user_func_array('mysqli_stmt_bind_param', $bindInfo)){
						$this->errorNumber = $this->conn->errno;
						$this->errorMessage = $this->conn->error;
					}
					//execute returns true if successful or false if it fails
					if(!($result = $this->statement->execute())){
						$this->errorNumber = $this->conn->errno;
						$this->errorMessage = $this->conn->error;
					}
				}
			}
			/*
			 * not using a prepared statement
			 */
			else{
				//if the database name doesn't exists or can not be accessed by 
				//the user then select will return false.  Otherwise it returns true
				if(!$this->conn->select_db($this->schemaName)){
						$this->errorNumber = $this->conn->errno;
						$this->errorMessage = $this->conn->error;
				}
				/*
				 * make sure that if the query fails, the error is recorded.
				 */
				if(!($result = $this->conn->query($sql))){
						$this->errorNumber = $this->conn->errno;
						$this->errorMessage = $this->conn->error;
				}
				if($result && !$treatAsChangeData){
					$this->numRowsFetched = mysqli_num_rows($result);
					$this->numResultFields = mysqli_num_fields($result);
					$this->fields = mysqli_fetch_fields($result);
				}
			}
			/*
			 * if there was no error in processing the query, get the results of the query
			 */
			if(!$this->errorNumber){
				/*
				 * get the key generated if any and determine 
				 * the number of rows affected by the change
				 */
				if($treatAsChangeData){
					$result = @$this->conn->getAffectedRows;
					$this->insertedID = @mysqli_insert_id($this->conn);
					if($numFields > 0){
						$this->statement->close();
					}
					
				}
				else{
					/*
					 * since is a data retrieval operation, create an array 
					 * to return to reduce coupling
					 */
					$resultArray = array();
					if($numFields > 0){
						$data = $this->statement->result_metadata();
						$this->numResultFields = mysqli_num_fields($data);
						$this->fields = mysqli_fetch_fields($data);
					}
					for ($i=0; $i < $this->numResultFields; $i++) 
					{ 
						//set the fields map to use the field name as a key and the field number as the key
						//this will allow lookups in the returned array by field name.
						$this->fields[$this->fields[$i]->name] = $i; 
					}
					/*
					 * handle prepared statement retreival different than standard SQL retreival
					 * A prepared statement is being used if the number of fields used to fill the ?'s
					 * is greater than zero
					 */
					if($numFields > 0){
						$args[0] = $this->statement;
				        $result = array();
						for($i = 0; $i < $this->numResultFields; $i++){
							$result[$i] = '';
							$args[$i+1] = &$result[$i];
				        }
				        call_user_func_array('mysqli_stmt_bind_result', $args);
				        while($this->statement->fetch()){
							$clone = array();
							for($i = 0; $i < $this->numResultFields; $i++){
								$clone[$i] = $result[$i];
							}
							$resultArray[] = $clone;
				        	$this->numRowsFetched++;
				        }
						$this->statement->free_result();
						$this->statement->close();
					}
					else{
						for($i = 0; $i < $this->numRowsFetched; $i++){
							$resultArray[] = $result->fetch_row();
						}
					}
					$result = $resultArray;
				}
			}
		}
		return $result;
	}
}
?>