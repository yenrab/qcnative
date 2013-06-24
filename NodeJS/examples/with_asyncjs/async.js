var QuickConnect = require('qcnode').QuickConnect,
async = require('async'),
fs = require('fs')
qc = new QuickConnect

qc.command('convince the world')
    .dcf(function(data, qc){
        async.map(data.files, function(item, cb){fs.writeFile(item,"hey",cb)}, function(err, results){
            if (err) {
                qc.asyncStackError(err)
                return
            }
            qc.asyncStackContinue('results1',results)
        })
        return qc.WAIT_FOR_DATA
    })
    .dcf(function(data, qc){
        async.filter(data.files, fs.exists, function(results){
            qc.asyncStackContinue('results2', results)
        })
        return qc.WAIT_FOR_DATA
    })
    .dcf(function(data, qc){
        async.map(data.files, fs.unlink, function(err, results){
            if (err) {
                qc.asyncStackError(err)
                return
            }
            qc.asyncStackContinue('results3', results)
        })
        return qc.WAIT_FOR_DATA
    })
    .dcf(function(data, qc){
        async.filter(data.files, fs.exists, function(results){
            qc.asyncStackContinue('results4', results)
        })
        return qc.WAIT_FOR_DATA
    })
    .vcf(function(data){
        console.log(data)
        return qc.STACK_CONTINUE
    })

qc.run('convince the world',{files:['file1','file2','file3']})