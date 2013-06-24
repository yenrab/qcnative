var mod = require('../../'),
	QuickConnect = mod.QuickConnect,
	assert = require('assert'),
	fs = require('fs'),
	basic


basic = new QuickConnect
other = new QuickConnect

other.command('wheeeee!', function(){
    this.valcf(function(data,qc){
        assert(data.done)
        return qc.STACK_CONTINUE
    })
})

other.isolate('iso', function(){
  this.command('wheeeee!', function(){
      this.valcf(function(data,qc){
          assert(data.done)
          return qc.STACK_CONTINUE
      })
  })
})
module.exports = basic

basic.command('basic stack to call', function(){
    this.valcf(function(data, qc){
        if (data.helol) {
            return qc.STACK_CONTINUE
        } else {
            return "this should not have been returned"
        }
    })
    this.dcf(function(data, qc){
        assert(data.helol)
        return this.STACK_CONTINUE
    })
    this.dcf(function(data, qc){
        setTimeout(function () {
            qc.asyncStackContinue()
        }, 5)
        return this.WAIT_FOR_DATA
    })
    this.dcf(function(data, qc){
        setTimeout(function () {
            qc.asyncStackContinue('key','koy')
        }, 50)
        return this.WAIT_FOR_DATA
    })
    this.dcf(function(data, qc){
        assert.equal(data.key,'koy')
        return this.STACK_CONTINUE
    })
    this.vcf(function(data, qc){
        data.done = true
        return this.STACK_CONTINUE
    })
})

basic.command('included stack', function(){
    this.valcf(function(data, qc){
        assert(!data.done)
        assert(qc)
        return qc.STACK_CONTINUE
    })
    this.dstack('basic stack to call')
    this.dstack('wheeeee!', other)
    this.dstack(['iso','wheeeee!'], other)
    this.vcf(function(data, qc){
        assert(data.done)
        return qc.WAIT_FOR_DATA
    })
})