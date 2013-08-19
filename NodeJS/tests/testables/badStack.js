var mod = require('../../'),
	QuickConnect = mod.QuickConnect,
	assert = require('assert'),
	fs = require('fs'),
	basic


basic = new QuickConnect
module.exports = basic

basic.command('bad stack', function(){
    try {
        this.valcf(null)
    } catch (error) {
        this.valcf(function (data) {
            data.valcferr = true
            return true
        })
    }
    
    try {
        this.dcf(null)
    } catch (error) {
        this.dcf(function (data) {
            data.dcferr = true
            return true
        })
    }
    
    try {
        this.vcf(null)
    } catch (error) {
        this.vcf(function (data) {
            data.vcferr = true
            return true
        })
    }
})