var mod = require('../../'),
	QuickConnect = mod.QuickConnect,
	assert = require('assert'),
	fs = require('fs'),
	basic = require('../testables/checkedStack'),
	test
	
test = new QuickConnect

test.command("run all tests", function(){
    this.dcf(
        checkAStack,
        checkdcfStack,
        checkvalcfStack,
        checkvcfStack
    )
})
module.exports = test

function checkAStack(data, qc) {
    assert(basic.checkForStack('basic stack to call'))
    return qc.STACK_CONTINUE
}
function checkdcfStack(data, qc) {
    assert(basic.checkForStack('check for one dcf'))
    return qc.STACK_CONTINUE
}
function checkvalcfStack(data, qc) {
    assert(basic.checkForStack('check for one valcf'))
    return qc.STACK_CONTINUE
}
function checkvcfStack(data, qc) {
    assert(basic.checkForStack('check for one vcf'))
    return qc.STACK_CONTINUE
}