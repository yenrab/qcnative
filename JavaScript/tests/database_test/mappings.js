qc.mapCommandToValCF('insert', checkInputValCF)
qc.mapCommandToDCF('insert', addPersonDCF)
qc.mapCommandToDCF('insert', getAllPersonsDCF)
qc.mapCommandToVCF('insert', displayFoundPersonsVCF)

qc.mapCommandToDCF('getAll', getAllPersonsDCF)
qc.mapCommandToVCF('getAll', displayFoundPersonsVCF)

qc.mapCommandToValCF('find', checkNameValCF)
qc.mapCommandToDCF('find', getPersonsByNameDCF)
qc.mapCommandToVCF('find', displayFoundPersonsVCF)


qc.mapCommandToValCF('delete', checkNameValCF)
qc.mapCommandToDCF('delete', deletePersonsWithNameDCF)
qc.mapCommandToDCF('delete', getAllPersonsDCF)
qc.mapCommandToVCF('delete', displayFoundPersonsVCF)

qc.mapCommandToVCF('missingValue', badInputECF)