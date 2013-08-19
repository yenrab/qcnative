var mod = require('../../'),
	QuickConnect = mod.QuickConnect,
	assert = require('assert'),
	fs = require('fs'),
	bad = require('../testables/badStack'),
	test
	
test = new QuickConnect

test.command("run all tests", function(){
    this.dcf(
        callBadStack
    )
})
module.exports = test

function callBadStack(data, qc){
    bad.run('bad stack',{'helol':'wold'},{
        end:function(data){
            assert(data.valcferr)
            assert(data.dcferr)
            assert(data.vcferr)
            qc.asyncStackContinue()
        },
        error:function(err){
            qc.asyncStackError(err)
        },
        validateFail:function(fails) {
            try {
                assert.fail(fails)
            } catch (error) {
                qc.asyncStackError(error)
            }
        }
    })
    return qc.WAIT_FOR_DATA
}
