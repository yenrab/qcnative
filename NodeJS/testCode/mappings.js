var functions = require('./functions.js')
var qc = require('./mappingUtil.js')
/*
 * map your control function stacks here. 
 */

qc.mapCommandToValCF( 'example', functions.checkDataValCF )
qc.mapCommandToValCF( 'example', functions.checkAgainValCF )
//for(var i = 0; i < 200; i++){
    qc.mapCommandToBCF( 'example', functions.computeSomethingBCF )
    qc.mapCommandToDCF( 'example', functions.somethingElseBCF )
//}
qc.mapCommandToDCF( 'example', functions.afterAsyncCallBCF )
qc.mapCommandToVCF( 'example', functions.writeToBrowserVCF )

qc.mapCommandToECF( 'bad juju', functions.someThingECF )



qc.mapCommandToValCF( 'just run', functions.checkDataValCF )
qc.mapCommandToValCF( 'just run', functions.checkAgainValCF )
qc.mapCommandToDCF( 'just run', functions.doNothingDCF )
qc.mapCommandToDCF( 'just run', functions.doNothingDCF )
qc.mapCommandToDCF( 'just run', functions.doNothingDCF )
qc.mapCommandToDCF( 'just run', functions.doNothingVCF )


