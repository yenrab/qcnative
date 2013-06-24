var mod = require('../../'),
	QuickConnect = mod.QuickConnect,
	assert = require('assert'),
	fs = require('fs'),
	chain = require('../testables/chainStacker'),
	test
	
test = new QuickConnect

test.command("run all tests", function(){
    this.dcf(
        callAStack,
        callOtherStack
    )
})
module.exports = test

function callAStack(data, qc) {
    chain.run('basic stack to call',{'helol':'wold'},{
        end:function(data){
            assert(data.done)
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

function callOtherStack(data, qc) {
    chain.run(['josh','is','cool','basic stack to call'],{'helol':'wold'},{
        end:function(res){
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
