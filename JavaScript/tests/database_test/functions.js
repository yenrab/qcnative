function checkInputValCF(parameters){
	if(!parameters.name || parameters.name.trim().length == 0
		|| !parameters.age || parameters.age.trim().length == 0){
		parameters.error = 'Name and age'
		qc.handleError('missingValue', parameters)
		return qc.STACK_EXIT
	}
	return qc.STACK_CONTINUE
}
function addPersonDCF(parameters){
	var aName = parameters.name
	DataAccess.transact('insertResult', "exampleDB", "INSERT INTO person VALUES(?,?);", [parameters.name, parameters.age]);
	return qc.STACK_WAIT
}
function getAllPersonsDCF(parameters){
	DataAccess.transact('foundPersons', 'exampleDB', 'SELECT * from person ORDER BY person.name')
	return qc.STACK_WAIT
}
function checkNameValCF(parameters){
	if(!parameters.name || parameters.name.trim().length == 0){
		parameters.error = 'Name'
		qc.handleError('missingValue', parameters)
		return qc.STACK_EXIT
	}
	return qc.STACK_CONTINUE
}
function getPersonsByNameDCF(parameters){
	DataAccess.transact('foundPersons', 'exampleDB', 'SELECT * from person where name = ?',[parameters.name])
	return qc.STACK_WAIT
}
function deletePersonsWithNameDCF(parameters){
	DataAccess.transact('removedPersonSucces', 'exampleDB', 'DELETE from person where name = ?',[parameters.name])
	return qc.STACK_WAIT
}
function displayFoundPersonsVCF(parameters){
	var table = document.createElement('table')
	var header = document.createElement('tr')
	table.appendChild(header)
	var nameHeader = document.createElement('th')
	nameHeader.innerText = 'NAME'
	var ageHeader = document.createElement('th')
	ageHeader.innerText = "AGE"
	header.appendChild(nameHeader)
	header.appendChild(ageHeader)
	var foundRecords = parameters.foundPersons.records
	var numRecords = foundRecords.length
	for(var i = 0; i < numRecords; i++){
		var aRow = document.createElement('tr')
		table.appendChild(aRow)
		var aRecord = foundRecords[i]
		for(var j = 0; j < 2; j++){
			var aTD = document.createElement('td')
			aTD.innerText = aRecord[j]
			aRow.appendChild(aTD)
		}
	}
	var displayDiv = document.getElementById(parameters.resultDisplayID)
	displayDiv.innerHTML = ''
	displayDiv.appendChild(table)
	return qc.STACK_CONTINUE
}

function badInputECF(parameters){
	var displayDiv = document.getElementById(parameters.resultDisplayID)
	displayDiv.innerText = 'ERROR: '+parameters.error+' must be set.'
}

