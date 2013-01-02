/*
 Copyright (c) 2012 Lee Barney
 Permission is hereby granted, free of charge, to any person obtaining a 
 copy of this software and associated documentation files (the "Software"), 
 to deal in the Software without restriction, including without limitation the 
 rights to use, copy, modify, merge, publish, distribute, sublicense, 
 and/or sell copies of the Software, and to permit persons to whom the Software 
 is furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be 
 included in all copies or substantial portions of the Software.
 
 
 
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
 PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
 CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
 OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 
 
 */


 var theWorker = self
 var customCommandMap = new Object()

initializeMessaging()

importScripts('QuickConnect.js','functions.js','mappings.js')


function initializeMessaging(){
  self.console = new Object()
  console.log = function(aMessage){
    if(aMessage){
      self.postMessage({'log':aMessage})
    }
  }
  console.error = function(aMessage){
    if(aMessage){
      self.postMessage({'err':aMessage})
    }
  }
  console.warn = function(aMessage){
    if(aMessage){
      self.postMessage({'warn':aMessage})
    }
  }
  var alert = function(aMessage){
    if(aMessage){
      self.postMessage({'alert':aMessage})
    }
  }
}

function debug(aMessage){
  console.log(aMessage)
}

self.theStack = null;

self.onmessage = function(event){
  var callData = JSON.parse(event.data);
  //console.log('data: '+JSON.stringify(callData))
  if(!callData.data.continue){
    //console.log(callData.cmd+' cloning: '+callData.data.stackID)
    self.uuid = callData.stackID
    qc.cloneConsumableStacks(callData.cmd, callData.data.stackID)
  }
  self.requestHandler(callData.cmd, callData.data)
}

self.requestHandler = function(aCmd, parameters){
  parameters.thisRequestWorker = self
  if(aCmd != null){
    if(qc.dispatchToValCF(aCmd, parameters, parameters.uuid) == qc.STACK_CONTINUE){
      if(qc.dispatchToDCF(aCmd, parameters, parameters.uuid) == qc.STACK_CONTINUE){
          delete parameters['thisRequestWorker']
          self.postMessage(JSON.stringify({'stackFlag':qc.STACK_CONTINUE, 'cmd':aCmd, 'data':parameters}))
      }
    }
  }
}