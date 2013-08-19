var mod = require('../../'),
	QuickConnect = mod.QuickConnect,
	assert = require('assert'),
	fs = require('fs'),
	basic = require('../testables/exitStack'),
	test

test = new QuickConnect

test.command("run all tests", function(){
    this.dcf(
        callAStack
    )
})
module.exports = test

function callAStack(data, qc) {
    basic.run('exit stack',{'helol':'wold'},{
        end:function(data){
            assert(!data.done)
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
