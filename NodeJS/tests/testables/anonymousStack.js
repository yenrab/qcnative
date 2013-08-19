var assert = require('assert'),
  map,
  hold

map = {
  ValCF:[],
  DCF:[],
  VCF:[]
}

hold = function(){
    this.ValCF.push(function(data, qc){
        if (data.helol) {
            return qc.STACK_CONTINUE
        } else {
            return "this should not have been returned"
        }
    })
    this.DCF.push(function(data, qc){
        assert(data.helol)
        return this.STACK_CONTINUE
    })
    this.DCF.push(function(data, qc){
        setTimeout(function () {
            qc.asyncStackContinue()
        }, 5)
        return this.WAIT_FOR_DATA
    })
    this.DCF.push(function(data, qc){
        setTimeout(function () {
            qc.asyncStackContinue('key','koy')
        }, 50)
        return this.WAIT_FOR_DATA
    })
    this.DCF.push(function(data, qc){
        assert.equal(data.key,'koy')
        return this.STACK_CONTINUE
    })
    this.VCF.push(function(data, qc){
        data.done = true
        return this.STACK_CONTINUE
    })
}
hold.call(map)

module.exports = map
