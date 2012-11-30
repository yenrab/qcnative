var qc = require('./QuickConnectNode.js' )

/********
This is where you will right the functions that will make up your stacks.
ValCF functions are validator functions that will return qc.STACK_CONTINUE or qc.STACK_EXIT depending on the success or failure of validation.
ValCFs are passed only the original data.
********/
exports.initialTime = 1
exports.finalTime = 1
function checkDataValCF( data ){
    if(exports.initialTime == 1){
        exports.initialTime = new Date().getTime()
    }
    return qc.STACK_CONTINUE
}

exports.checkDataValCF = checkDataValCF

function checkAgainValCF( data ){
    return qc.STACK_CONTINUE
}

exports.checkAgainValCF = checkAgainValCF

function computeSomethingDCF( data ){
    data.firstCalc = 'computed in computeSomethingDCF'
    return qc.STACK_CONTINUE
}
exports.computeSomethingDCF = computeSomethingDCF

function somethingElseDCF( data, uuid, commandArray, allStacksCompleteCallback ){
	setTimeout(function(){ qc.handleAsyncCompletion( uuid, "async_data","hello  from async", commandArray, allStacksCompleteCallback)}, 100 )
	return qc.WAIT_FOR_DATA
}
exports.somethingElseDCF = somethingElseDCF

function afterAsyncCallDCF( data ){
    data.secondCalc = 'something calculated after async'
    return qc.STACK_CONTINUE
}
exports.afterAsyncCallDCF = afterAsyncCallDCF

function writeToBrowserVCF( data ){
    exports.finalTime = new Date().getTime()
    console.log("finishing a request "+data.aNum)
    return qc.STACK_CONTINUE
}
exports.writeToBrowserVCF = writeToBrowserVCF

function someThingECF( data ){
    console.log("Executing ECF")
    return qc.STACK_CONTINUE
}
exports.someThingECF = someThingECF

function doNothingDCF( data ){
	console.log(this)
	console.log(arguments)
	console.log(arguments.caller)
    return qc.STACK_CONTINUE
}
exports.doNothingDCF = doNothingDCF


function doNothingVCF( data ){
    exports.finalTime = new Date().getTime()
    return qc.STACK_CONTINUE
}
exports.doNothingVCF = doNothingVCF

