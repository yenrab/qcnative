

function getRemoteDataDCF(parameters){
	var parameterId = 'retrievedData'
	//ServerAccess.transact(parameterId, 'GET', 'http://search.twitter.com/search.json?q=blue%20angels&rpp=5&include_entities=true&result_type=mixed', ServerAccess.JSON)
	ServerAccess.transact(parameterId, 'GET', 'http://www.alfanous.org/json?list=recitations', ServerAccess.TEXT)
	return qc.STACK_WAIT
}

function showRemoteDataVCF(parameters){
	console.log('showing: '+document.getElementById('display'))
	document.getElementById('display').innerHTML = JSON.stringify(parameters.retrievedData)
	return qc.STACK_CONTINUE
}

