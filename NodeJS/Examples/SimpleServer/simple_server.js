var http = require('http')
var fs = require('fs')
var path = require('path')

http.createServer(function (request, response) {
  console.log('request starting...')
	
	request.on('data', function(chunk) {
      console.log("Received body data:");
      console.log(chunk.toString());
    });
    
    request.on('end', function() {
      // empty 200 OK response for now
      response.writeHead(200, "OK", {'Content-Type': 'text/html'});
      response.end();
    });
		
	var filePath = '.' + request.url
	if (filePath == './'){
			filePath = './index.html'
	}
	var contentType = 'text/html'
	 
	path.exists(filePath, function(exists) {
	 
	if (exists) {
			fs.readFile(filePath, function(error, content) {
					if (error) {
							response.writeHead(500)
							response.end()
					}
					else {
							response.writeHead(200, { 'Content-Type': 'text/html' })
							response.end(content, 'utf-8')
					}
			})
	}
	else {
			response.writeHead(404)
			response.end()
	}
});}).listen(1337, '127.0.0.1')
console.log('Server running at http://127.0.0.1:1337/')



