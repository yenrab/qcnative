var assert = require('assert'),
child = require('child_process'),
takeOut = [
  '__filename',
  'exports',
  'module',
  '__dirname',
  'require'
]

module.exports.run = function(a,b,cbs){
    var qc = require('../../'),
    keys = Object.keys(global),
    globalKeys

    child.exec("node -e 'console.log(JSON.stringify(Object.keys(global)))'",
      function(err, stdout, stderr){
        assert(!err)
        assert.equal('',stderr.toString().trim())
        globalKeys = JSON.parse(stdout.toString())
        globalKeys = globalKeys.filter(function(val){
          return !~takeOut.indexOf(val)
        })
        assert.equal(keys.length, globalKeys.length)
        assert.deepEqual(keys, globalKeys)
        setImmediate(cbs.end)
      }
    )
}
