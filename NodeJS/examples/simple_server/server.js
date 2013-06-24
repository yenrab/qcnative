var QuickConnect = require('qcnode').QuickConnect,
resolve = require('path').resolve,
http = require('http'),
ur = require('url'),
fs = require('fs'),
//yes, I do like to 'require' from longest to shortest
qc = new QuickConnect,

statik = qc.isolate('request').isolate('static')


statik.command('GET')
.valcf(function(data,qc){
    if (!data.file) {
        return "no file specified"
    } else {
        return qc.STACK_CONTINUE
    }
})
.dcf(function(data,qc){
    fs.readFile(resolve('static',data.file), function(err, content){
        if (err) {
            qc.asyncStackError(err)
            return
        }
        qc.asyncStackContinue('content', content)
    })
    return qc.WAIT_FOR_DATA
})
.vcf(function(data,qc){
    data.response.writeHead(200)
    data.response.end(data.content)
    return qc.STACK_CONTINUE
})

http.createServer(function(req, res){
    var url = ur.parse(req.url),
    method = req.method,
    pathParts = url.pathname.split('/').filter(function(v){return v}),//removes ''
    action = ['request', pathParts.shift(), method]
    try {
        qc.run(action,{file:pathParts.shift(), response:res},{
            error: function(err){
                res.writeHead(500)
                res.end('arg!: '+err.stack)
            },
            validateFail: function (failMsgs) {
                res.writeHead(400)
                res.end(JSON.stringify(failMsgs))
            }
        })
    } catch (error) {
        res.writeHead(404)
        res.end('?')
    }
}).listen(9090)
