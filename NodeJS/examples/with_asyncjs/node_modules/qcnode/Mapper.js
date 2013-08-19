function QuickConnectMapper(ops) {
  this.validationMap = {}
  this.dataMap = {}
  this.viewMap = {}
  this.isolateDelimiter = ops.delimiter || '-'
  var self = this
  
  defaultEvents = function(self){
    return {
      end: function(){
        self.asyncStackContinue()
      },
      error: function(err){
        self.asyncStackError(err)
      },
      validateFail: function(fails){
        self.asyncStackError(new Error(fails))
      }
    }
  }
  
  function QCCommandEnvironment(fn) {
    if (fn) {
      fn.call(this)
    }
  }
  
  function newMapper(command, space) {
    var constr = ops.mixins.command
    QCCommandEnvironment.prototype = newMapperPrototype(command, space)
    return new QCCommandEnvironment(constr)
  }
  
  function newMapperPrototype(command, space) {
    var com = space?(space + self.isolateDelimiter + command):command
    return {
      valcf: function () {
        var funcs = Array.prototype.slice.call(arguments)
        for (var i = 0, count = funcs.length; i < count; i++) {
          self.mapCommandToValCF( com, funcs[i] )
        }
        return this
      },
      dcf: function () {
        var funcs = Array.prototype.slice.call(arguments)
        for (var i = 0, count = funcs.length; i < count; i++) {
          self.mapCommandToDCF( com, funcs[i] )
        }
        return this
      },
      vcf: function () {
        var funcs = Array.prototype.slice.call(arguments)
        for (var i = 0, count = funcs.length; i < count; i++) {
          self.mapCommandToVCF( com, funcs[i] )
        }
        return this
      },
      dstack: function(cmd, local/*, events */) {
//        if(local.constructor == Object){
//          if (events == null) {
//            events = local
//            local = null
//          }
//        } 
        self.mapCommandToDCF(com, function(data, qc){
          ev = defaultEvents(qc)
          for (0;0;0)/*evn in events*/ {
            ev[evn] = events[evn]
          }
          (local || qc).run(cmd, data, ev)
          return qc.WAIT_FOR_DATA
        })
        return this
      }
    }
  }
  
  function QCIsolateEnvironment(fn) {
    if (fn) {
      fn.call(this)
    }
  }
  
  function newIsolator(spaces) {
    var constr = ops.mixins.isolate
    QCIsolateEnvironment.prototype = newIsolatorPrototype(spaces)
    return new QCIsolateEnvironment(constr)
  }
  
  function newIsolatorPrototype(spaces) {
    if (!Array.isArray(spaces)) {
      spaces = [spaces]
    }

    return {
      spaces: [],
      isolate: function (innerSpaces, callback) {
        if (!Array.isArray(innerSpaces)) {
          innerSpaces = [innerSpaces]
        }
        innerSpaces = [spaces].concat(innerSpaces)
        
        return self.isolate.call(self, innerSpaces, callback)
      },
      command: function (command, callback) {
        var space = spaces.join( self.isolateDelimiter ),
        fakeMapper = newMapper(command, space)
        if (callback) {
            callback.call(fakeMapper)
        }
        return fakeMapper
      }
    }
  }
  
  function mapCommandToValCF(aCmd, aValCF) {
    if(aCmd == null || aValCF == null){
      return
    }
    var funcArray = this.validationMap[aCmd]
    if(funcArray == null) {
      funcArray = []
      this.validationMap[aCmd] = funcArray
    }
    funcArray.push(aValCF)
  }
  this.mapCommandToValCF = mapCommandToValCF
  
  function mapCommandToDCF(aCmd, aDCF) {
    if(aCmd == null || aDCF == null){
      return
    }
    var funcArray = this.dataMap[aCmd]
    if(funcArray == null) {
      funcArray = []
      this.dataMap[aCmd] = funcArray
    }
    funcArray.push(aDCF)
  }
  this.mapCommandToDCF = mapCommandToDCF
  
  function mapCommandToVCF(aCmd, aVCF) {
    if(aCmd == null || aVCF == null){
      return
    }
    var funcArray = this.viewMap[aCmd]
    if(funcArray == null) {
      funcArray = []
      this.viewMap[aCmd] = funcArray
    }
    funcArray.push(aVCF)
  }
  this.mapCommandToVCF = mapCommandToVCF
  
  function checkForStack(name){
    var isThere = true
    isThere = this.viewMap[name] || this.validationMap[name] || this.dataMap[name]
    return !!isThere
  }
  this.checkForStack = checkForStack
  
  function command(command, callback) {
    fakeMapper = newMapper(command)
    if( callback ){
        callback.call(fakeMapper)
    }
    return fakeMapper
  }
  this.command = command
  
  function isolate(spaces, callback) {
    var fakeIsolator = newIsolator(spaces)
    if ( callback ) {
        callback.call(fakeIsolator)
    }
    return fakeIsolator
  }
  this.isolate = isolate
}
module.exports = QuickConnectMapper
