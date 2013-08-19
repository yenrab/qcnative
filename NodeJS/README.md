QCNode 1.4.x
======

The QuickConnect Framework for Node.js. Flow control, application controller logic, and so much more!

## Installation
```
npm install qcnode
```

## What is it for?

The QuickConnect framework for Node.js is designed to help the developer quickly write, debug, and run asynchronous or synchronous code. The framework encourages code re-use and modularity.

## How do I use it?

There are many ways!

### Simple Example
```javascript
QuickConnect = require('qcnode').QuickConnect
var qc = new QuickConnect

qc.command('list filtered files', function(){
	this.valcf( function(data, qc){
		if(qc === this){ //it does
			return this.STACK_CONTINUE
		} else {
			return "this is impossible"
		}		
	})
	this.dcf( function(data, qc){
		fs.readdir(data.dirPath, function(err, files){
			if(err){
				//maybe handle it here, if I want
				qc.asyncStackError(err)
				return
			}
			qc.asyncStackContinue('files',files)
		})
		return qc.WAIT_FOR_DATA
	})
	this.dcf( function(data, qc){
		data.filteredFiles = data.files.filter(function(val){return val != data.filter})
	})
	this.vcf( function(data, qc){
		for(var fi in data.filteredFiles){
			console.log(fi)
		}
		return qc.STACK_EXIT
	})
})

...

var stack = qc.handleRequest('login', myData) // .handleRequest === .run

stack.on('error', function(err, data, index){
	//handle the error out here, where I know what is going on.
	console.log("unable to filter files right now: "+err.stack)
})

stack.on('end', function(data, index){
	console.log('yay!')
})

```

### Less Simple Example
```javascript
qc.isolate('request' function(){
	this.isolate( 'GET', function(){
		this.command('contest', function(){
			this.valcf(function(data){
				if(+new Date < limit){
					return "the contest has not begun"
				}
				return this.STACK_CONTINUE
			})
			this.dcf(function(data){
				data.response.writeHead(200)
				data.response.end(JSON.stringify({message:"you are a winner!"}))
				return this.STACK_CONTINUE
			})
		})	
	})
	this.isolate( 'DELETE', function(){
		//more logic
	})
})

...

http.createServer(function(req, res){
	//this will dynamically select what command to run based on the url!
	
	url = require('url').parse(req.url, true)
	action = ['request',req.method]
	urlParts = url.pathname.split('/').filter(function(v){return v})//removes ''
	action = action.concat(urlParts)
	try {
		qc.run(action,{response:res},{ 
			error: function(err){
				res.write(500)
				res.end("error")
			},
			validateFail: function(failMsgs){
				res.write(422)
				res.end(JSON.stringify({errors:failsMsgs}))
			}
		})
	catch (err) {
		//stack is not defined
		res.write(404)
		res.end(cached404page)
	}
})
```
#### Josh, you just made more callbacks…
Um… No I didn't! Pay no attention to the man behind the callbacks! This code gets run top-to-bottom; the callbacks are just helpers.

Well, fine. These examples are actually written in a shorthand that was helpful while writting coffeescript. it looks like this in coffeescript:

```coffeescript
qc.isolate 'request', ->
	@isolate 'GET', ->
		@command 'contest', ->
			@valcf (data) ->
				if +new Date < limit
					"the contest has not begun" 
				else 
					@STACK_CONTINUE
			@dcf (data) ->
				data.response.writeHead 200
				data.response.end JSON.stringify message:"you are a winner!"
	@isolate 'DELETE', ->
		#more logic
```

It's pretty simple to write and read with that shorthand. Here is what is actually happening _in the code:_

```javascript
var delim = qc.mapper.isolateDelimiter
qc.mapper.mapCommandToValCF(['request','GET','contest'].join(delim), myValCF)
qc.mapper.mapCommandToValCF(['request','GET','contest'].join(delim), myDCF)
//ect...
```

That is also very readable, but it takes a lot of characters.

### Do you like Chaining?
Since `isolate`,`command`, and the `cf` functions all return the same object that is `this` in the callbacks, you can chain! Here is an example from the qc tests:

```javascript
basic.command('basic stack to call')
    .valcf(function(data, qc){
        if (data.helol) {
            return qc.STACK_CONTINUE
        } else {
            return "this should not have been returned"
        }
    })
    .dcf(function(data, qc){
        assert(data.helol)
        return this.STACK_CONTINUE
    })
    .dcf(function(data, qc){
        setTimeout(function () {
            qc.asyncStackContinue()
        }, 5)
        return this.WAIT_FOR_DATA
    })
    .dcf(function(data, qc){
        setTimeout(function () {
            qc.asyncStackContinue('key','koy')
        }, 50)
        return this.WAIT_FOR_DATA
    })
    .dcf(function(data, qc){
        assert.equal(data.key,'koy')
        return this.STACK_CONTINUE
    })
    .vcf(function(data, qc){
        data.done = true
        return this.STACK_CONTINUE
    })
```
That's probably a more javascript-y way.
You just have to remember that `isolate`, `command`, and `cf` functions do not return the same object. This is not valid:

```javascript
//error!
basic.isolate(isol).command(mycom).valcf(myfunc).command(otherCom).ect(…)
```
Remember, if you can chain something, you can store it.

```javascript
iso = basic.isolate(isol)
comOne = iso.command(mycom)
comOne.valcf(myfunc).dcf(dfunc)
comTwo = iso.command(otherCom)
comTwo.ect(...)
```

## Could you change "X" to be "y"?
No, but **you** can with [mixins!](https://github.com/QuickConnect/QCNode/wiki/Mixin-Guide)

## So?

So this is awesome! You can use QC in the way that works for you. It's more than just flow control, it's designed to help you get things done faster, higher, and stronger. 

## But how can I use it in ...?
Head on over to [our example page!](https://github.com/QuickConnect/QCNode/wiki/examples)

## QC History
QuickConnect started as a response to some of the problems encountered writing code for Enterprise Java servers. The framework pattern evolved for several years in a hybrid mobile environment (QCHybrid, iOS and Android) which provided tools for rapid prototyping of cross-platform apps. 

From the async javascript environment of mobile web views, the jump to Node.js was natural, but required some heavy thinking and adaptation to match the node way of doing things. The first port was done by a developer for a mobile app company--this port was made open source after donation back to the main QC developer. The first version published for install via npm was a complete re-write of that first port; this resulted in a smaller, better QC that fuctions across many versions of node.

### Version numbers
QC is pretty mature and very functional, so it didn't make sense to publish a version <1.0.0

Here is how it works: When we change to version x.y.z

* x : your stuff will probably break
* y : your stuff will probably not break
* z : we fixed something, wrote a test, or something small

## Contribute
Because QC has a history older than Node.js, it has some things in it that are leftovers from other incarnations. 'handleRequest' is the oldest part; it comes from living on a server that handles client requests. It has been pointed out that a 'request', a 'command', and a 'stack' are all related, but come from different points in the history. We want to increase the 'y' part of the version by building better ways for people to use QC in their codeflow and workflow.

Fork the repo, submit a pull request and tell us your rational for the change; we would love to hear all ideas.

We feel the core logic of QC is pretty set in version 1.0.0, but if you have ideas for version 2.0.0, fork the repo or drop us a line!

# Licence
MIT

Copyright (c) 2013 Joshua Barney, Lee Barney

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.