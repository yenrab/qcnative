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
function mapCommandToBCF($cmd, $bcf){
	global $businessMap;
	$businessMap = mapCommandTo($businessMap, $cmd, $bcf);

}function mapCommandToVCF($cmd, $vcf){
	global $viewMap;
	$viewMap = mapCommandTo($viewMap, $cmd, $vcf);
}function mapCommandToValCF($cmd, $valcf){
	global $validationMap;
	$validationMap = mapCommandTo($validationMap, $cmd, $valcf);
}function mapCommandToECF($cmd, $ecf){
	global $errorMap;
	$errorMap = mapCommandTo($errorMap, $cmd, $ecf);
}function mapCommandTo($map, $cmd, $controlFunction){
	$commandFunctions = @$map[$cmd];
	if(!$commandFunctions){
		$commandFunctions = array();
		$map[$cmd] =& $commandFunctions;
	}
	$commandFunctions[] = $controlFunction;
	$map[$cmd] =& $commandFunctions;
	return $map;
}
?>