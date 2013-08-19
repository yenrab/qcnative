var mod = require('../../'),
	QuickConnect = mod.QuickConnect,
	assert = require('assert'),
	fs = require('fs'),
	mixin


mixin = new QuickConnect({
    mixins: {
        base:function () {
            this.namespace = this.isolate
        },
        isolate:function () {
            this.addNamespace = this.isolate
            this.map = this.command
        },
        command:function () {
            this.validate = this.valcf
            this.data = this.dcf
            this.view = this.vcf
        },
        control:function () {
            this.go = this.STACK_CONTINUE
            this.asyncGo = this.asyncStackContinue
            this.wait = this.WAIT_FOR_DATA
        }
    }
})
module.exports = mixin

mixin.namespace('mixin')
.addNamespace('level 2')
.map('command')
.validate(function(){return true})
.data(function(){return this.go})
.data(function(data,qc){
    setTimeout(function(){qc.asyncGo()}, 50)
    return qc.wait
})
.view(function(data,qc){
    data.yay = true
    return qc.go
})

