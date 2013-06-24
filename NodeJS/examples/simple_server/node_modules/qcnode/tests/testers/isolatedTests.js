var mod = require('../../'),
	QuickConnect = mod.QuickConnect,
	assert = require('assert'),
	fs = require('fs'),
	basic = require('../testables/isolatedStack'),
	test
	
test = new QuickConnect

test.command("run all tests", function(){
    this.dcf(
        callIsoStack,
        callIsoStack2,
        callIsoStack3,
        callIsoStack4,
        callIsoStack5
    )
})
module.exports = test

function callIsoStack(data, qc) {
    basic.run('josh-basic stack to call',{'helol':'wold'},{
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
function callIsoStack2(data, qc) {
    basic.run(['josh','basic stack to call'],{'helol':'wold'},{
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
function callIsoStack3(data, qc) {
    basic.run('josh-level 2-basic stack to call',{'helol':'wold'},{
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
function callIsoStack4(data, qc) {
    basic.run(['josh','level 2','basic stack to call'],{'helol':'wold'},{
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
function callIsoStack5(data, qc) {
    basic.run(['josh','is','cool','basic stack to call'],{'helol':'wold'},{
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