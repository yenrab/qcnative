<?php /* 
 Copyright (c) 2007, 2008, 2009, 2012 Lee Barney
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
 */?>
<?php
	//the application controller maps
	$validationMap = array();
	$dataMap = array();
	$viewMap = array();
	$errorMap = array();
	//include the files containing the Controller objects
	require_once getcwd().DIRECTORY_SEPARATOR.'constants.inc';
	require_once getcwd().DIRECTORY_SEPARATOR.'functions.inc';
	require_once getcwd().DIRECTORY_SEPARATOR.'utilities.inc';
	require_once getcwd().DIRECTORY_SEPARATOR.'mappings.inc';
	require_once getcwd().DIRECTORY_SEPARATOR.'MySQLDataAccessObject.inc';
	/*
	 * The front controller implementation
	 */
	$parameters = $_REQUEST;
	/*
	 * 
	 * Check security for the command passed in the request and set the non-default command if there is one.
	 * If it fails then set the command to go to the default page
	 */
	$command = @$_REQUEST['cmd'];
	if($command){
		$result = dispatchToValCFs($command, $parameters);
		if($result != QC::STACK_EXIT){
			//dispatch the request to retrieve, add, change data, etc.
			$result = dispatchToDCFs($command, $parameters);
			if($result != QC::STACK_EXIT){
			//dispatch the request to generate the display information
				dispatchToVCFs($command, $parameters);
			}
		}
	}
	/*
	 * The application controller implementation
	 */
	function dispatchToValCFs($cmd, $parameters){
		global $validationMap;
		return dispatchTo($validationMap, $cmd, $parameters, null);
	}
	function dispatchToDCFs($cmd, $parameters){
		global $dataMap;
		return dispatchTo($dataMap, $cmd, $parameters, null);
	}
	function dispatchToVCFs($cmd, $parameters)
	{
		global $viewMap;
		return dispatchTo($viewMap, $cmd, $parameters);
	}
	function dispatchToECFs($cmd, $parameters){
		global $errorMap;
		return dispatchTo($errorMap, $cmd, $parameters);
	}
	function dispatchTo($aMap, $cmd, $parameters){
		global $errorMap;
		global $viewMap;
		$mappingFunctions = $aMap[$cmd];
		if($mappingFunctions){
			$numFuncs = count($mappingFunctions);
			for($i = 0; $i < $numFuncs; $i++){
				$controlFunction = $mappingFunctions[$i];
				$controlFunction($parameters);
				if($aResult == QC::STACK_EXIT){
					return QC::STACK_EXIT;
				}
			}
			return $results;
		}
	}
?>