<?php
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



/*
*  THIS CLASS IS NON_FUNCTIONAL AT THIS TIME.  IT IS NOT COMPLETE.  DON'T USE IT.
*/


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
 * If a standard SQL string is used, mysql_real_escape_string will be called to secure the data.
 * This means that any SQL strings with single quotes will fail purposefully.  Use prepared statements
 * for most all SQL execution.
 */
class OracleDataAccessObject{
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
		$this->conn = oci_connect($this->userName,$this->password,$this->dbURL);
		if(!$this->conn){
			$error = oci_error();
			$this->errorMessage = $error['message'];
			$this->errorNumber = $error['code'];
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
		$this->commitType = OCI_DEFAULT;
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
		oci_rollback($this->conn);
	}
	/*
	 * close the connection
	 */
	public function done(){
		oci_close($conn);
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
			$sql = "BEGIN ".$proceedureName."(";
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
			$numFields = sizeof($fieldValueArray);
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
				if (!$fieldValueArray[$i][1]){
					$this->errorNumber = -1202;
					$this->errorMessage = "Parameter $i's value is null";
					break;
				}
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
				if(!($this->statement = oci_parse($this->conn,$sql))){
					$error = oci_error($this->conn);
					$this->errorMessage = $error['message'];
					$this->errorNumber = $error['code'];
				}
				if($numFields > 0 && !$this->errorNumber){
					//if a get is being done by binding variables(using prepared statements)
					if($fieldValueArray != null){
						$lobArray;
						for($i = 0; $i < $numFields; $i++){
							//handle CLOB and BLOB types
							if($treatAsChangeData && $fieldValueArray[$i][2] == SQLT_CLOB || $fieldValueArray[$i][2] == SQLT_BLOB){
								$lobArray[] = $this->prepareLob($this->statement, $fieldValueArray[$i] , $lobArray);
							}
							//handle other types
							else if(!oci_bind_by_name($this->statement, $fieldValueArray[$i][0], $fieldValueArray[$i][1], -1, $fieldValueArray[$i][2])){
								$error = oci_error($this->statement);
								$this->errorMessage = $error['message'];
								$this->errorNumber = $error['code'];
							}
						}
					}
					/*
					 * putting data into the database
					 */
					if($treatAsChangeData){
						if($this->commitType == OCI_COMMIT_ON_SUCCESS && $lobArray){
							$this->errorMessage = 'Transactions must be used when storing LOBs.';
							$this->errorNumber = -1203;
						}
						else if(oci_execute($stmt, $this->commitType)){
							$lobArrayLength = count($lobArray);
							//save the lob information into the database LOB objects
							for($i = 0; $i < $lobArrayLength; $i++){
								$lobArray[$i][0]->save($lobArray[$i][1]);
							}
							//and commit the changes
							if(!($result = oci_commit($this->conn))){
								$error = oci_error($this->conn);
								$this->errorMessage = $error['message'];
								$this->errorNumber = $error['code'];
							}
						}
						else{
							$error = oci_error($this->statement);
							$this->errorMessage = $error['message'];
							$this->errorNumber = $error['code'];
						}
					}
					//must be doing some form of data retrieval
					else if(!oci_execute($stmt)){
						$error = oci_error($this->statement);
						$this->errorMessage = $error['message'];
						$this->errorNumber = $error['code'];
					}
					if(!$treatAsChangeData){
						//execute fetch all if no error has happened
						if(!$this->errorMessage && !$this->numRowsFetched = oci_fetch_all($stmt, $result)){
							$error = oci_error($this->statement);
							$this->errorMessage = $error['message'];
							$this->errorNumber = $error['code'];
						}
					}
					//free and close the connection as soon as possible to free it up for further use
					if(!oci_free_statement($stmt)){
						$this->errorMessage = 'Unable to free statement';
						$this->errorNumber = -1202;
					}
					/*
					 * pull the data out of the oracle result set and put it in a PHP array
					 */
					if(!$treatAsChangeData){
						$result = array();
						$this->fields = array();
						foreach ($this->data as $fieldName => $field) {
							$this->fields[$fieldName] = $fieldNumber;
						}
						$this->numResultFields = count($this->fields);
						for ($i = 0; $i < $this->numRowsFetched; $i++) {
							$fieldNumber = 0;
							foreach ($this->data as $field) {
								$result[$i][$fieldNum] = $field[$i];
								$fieldNumber++;
							}
						}
					}
				}
			}
		}
		return $result;

	}
	private function prepareLob($stmt, $field, $lobArray){
		$aLob = oci_new_descriptor($this->conn, OCI_D_LOB);
		//define a variable name to map the the clob
		$success =  oci_define_by_name($stmt, $field[0], $aLob, $field[2]);
		//bind the php variable to the OCI clob variable name
		$success = oci_bind_by_name($stmt, $field[0], $aLob, -1, $field[2]);
		//return an array of the lob and the value to be stored in it
		//once the execute method has been called
		return array($aLob, $field[1]);
	}
}
?>