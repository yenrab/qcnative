function testValCF(parameters){
	console.log("testValCF")
	return qc.STACK_CONTINUE
}

function testDCF(parameters){
	var limit = Math.random() * 1000000
	parameters.limit = limit
	for(var i = 0; i < limit; i++){}
	console.log("testDCF")
	return qc.STACK_CONTINUE
}

function testVCF(parameters){
	console.log('testVCF')
	document.getElementById('display').innerText += "\ntestVCF "+JSON.stringify(parameters)
	return qc.STACK_CONTINUE
}


function test2ValCF(parameters){
	console.log('test 2 val')
	return qc.STACK_CONTINUEs
}

function test2DCF(parameters){
	var limit = Math.random() * 1000000
	parameters.limit = limit
	for(var i = 0; i < limit; i++){}
	console.log("test 2 DCF")
	return qc.STACK_CONTINUE
}

function test2VCF(parameters){
	console.log('test 2 VCF')
	document.getElementById('display').innerText += "\ntest 2 VCF "+JSON.stringify(parameters)
	return qc.STACK_CONTINUE
}

