var QuickConnect = require('qcnode').QuickConnect,
defaultRoute = 'hello',

http = require('http'),
u = require('url'),
server = http.createServer()

qc = new QuickConnect({
  mixins: {
    base: function(){
      this.route = function(route){
        var parts, part,
        root, obj,
        i, count

        parts = route.split('/')
        if(parts[0] == ''){
          parts.shift()
          root = true
        }

        obj = this

        if(!root){
          obj = obj.isolate(defaultRoute)
        }

        for(i = 0, count = parts.length - 1; i < count; i++){
          part = parts.shift()
          obj = obj.isolate(part)
        }
        obj = obj.command(parts.shift())
        return obj
      }
    }
  }
})

qc.route('/hello/world')
.dcf(function(data){
  console.log('hello world')
  data.res.writeHead(200)
  data.res.end('hello world')
  return this.STACK_CONTINUE
})


server.on('request', function(req, res){
  var url

  url = u.parse(req.url, true, true)
  path = url.path
  path = path.split('/').filter(function(v){return v})

  try{
    qc.run(path,{res:res},{
      end:function(){
        console.log('ended')
      },
      error:function(err){
        console.error(err)
      }
    })
  } catch(err) {
    res.writeHead(404)
    res.end('404')
  }

})

server.listen(9090)
process.on('exit',server.close)
