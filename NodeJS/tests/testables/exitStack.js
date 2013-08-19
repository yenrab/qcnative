var mod = require('../../'),
	QuickConnect = mod.QuickConnect,
	assert = require('assert'),
	fs = require('fs'),
	basic


basic = new QuickConnect
module.exports = basic

basic.command('exit stack', function(){
    this.valcf(function(data, qc){
        return this.STACK_EXIT
    })
    this.dcf(function(data, qc){
        assert(false)
        return this.STACK_CONTINUE
    })
})
