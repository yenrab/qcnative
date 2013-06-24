var resolve = require('path').resolve,
    mod = require(resolve(__dirname,'../')),
	QuickConnect = mod.QuickConnect,
	fs = require('fs')
	
test = new QuickConnect

test.command("running all the tests", function(){
    this.dcf(function(data, qc){
        fs.readdir(resolve(__dirname,'testers'),function(err, files){
            var index
            if (err) {
                qc.asyncStackError(err)
            } else {
                qc.asyncStackContinue('files',files)
            }
        })
        return qc.WAIT_FOR_DATA
    })
    this.dcf(function(data, qc){
        var i, count
        
        count = data.files.length
        for (i = 0; i < count; i++) {
        (function(){
            var file = data.files[i]
            var tester = require(resolve(__dirname,'testers',file))
            tester.run('run all tests',{},{
                end: function(data){
                    count--
                    console.log('finished tests in '+file)
                    !count&&qc.asyncStackContinue()
                },
                error: function(err, data){
                    count--
                    console.log('error for tests in '+file+':\n\n'+err.stack)
                    !count&&qc.asyncStackContinue()
                }
            })
            console.log("running tests in "+file)
        }).call(this)
        }
        return qc.WAIT_FOR_DATA
    })
})

test.run('running all the tests',{})