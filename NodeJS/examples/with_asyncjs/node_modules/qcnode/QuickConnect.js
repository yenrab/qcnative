var Mapper = require('./Mapper'),
    Stack = require('./Stack').Stack

function QuickConnect(ops) {
    var mapper, debug
    
    if (!ops) {
        ops = {}
    }
    if (!ops.mixins) {
      ops.mixins = {}
    }
    
    this.options = ops

    this.WAIT_FOR_DATA = 'wAiT'
    this.STACK_EXIT = 'ExIt_StAcK'
    this.STACK_CONTINUE = true

    mapper = new Mapper(ops)
    this.mapper = mapper

    debug = ops.debug || console.log
    this.debug = debug

    if (ops.mixins.base) {
      ops.mixins.base.call(this)
    }
}

function fakeQC(self){
    return {
        WAIT_FOR_DATA: 'wAiT',
        STACK_EXIT: 'ExIt_StAcK',
        STACK_CONTINUE: true,
        handleRequest: function () {
            return handleRequest.apply(self, [].slice.call(arguments, 0))
        },
        handleRequests: function () {
            return handleRequests.apply(self, [].slice.call(arguments, 0))
        },
        checkForStack: function () {
            return checkForStack.apply(self, [].slice.call(arguments, 0))
        },
        debug: self.debug,
        nextTick: self.nextTick
    }
}

function genrateUUID() {
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
    })
    return uuid
}

function blah() {
    var immediateExists = true
    try {
        setImmediate(function () {})
    } catch (e) {
        immediateExists = false
    }
    this.nextTick = function (fn, prefereNextTick) {
        if (prefereNextTick || !immediateExists) {
            process.nextTick(fn)
        } else {
            setImmediate(fn)
        }
    }
}
blah.call(QuickConnect.prototype)

function cloneConsumableStacks(aCmd) {

    var funcs = {
    },
    mapper = this.mapper

    //if mappings are found then duplicate the mapped 
    //control function arrays for consumption
    if (!mapper.validationMap[aCmd] && !mapper.dataMap[aCmd] && !mapper.viewMap[aCmd]) {
        return
    }

    funcs.validationMapConsumables = (mapper.validationMap[aCmd] || []).slice()
    funcs.dataMapConsumables = (mapper.dataMap[aCmd] || []).slice()
    funcs.viewMapConsumables = (mapper.viewMap[aCmd] || []).slice()

    return funcs
}

function handleRequest(aCmd, requestData, callbacks ) {
    var stack, uuid, funcs, event
    
    if (Array.isArray(aCmd)) {
      aCmd = aCmd.join(this.mapper.isolateDelimiter)
    }
    
    if (callbacks && callbacks.constructor != Object) {
        callbacks = {
            'end': callbacks
        }
    }
    uuid = genrateUUID()
    funcs = cloneConsumableStacks.call(this, aCmd)
    if (!funcs) {
        throw new Error('Attempting to execute the command "' + (aCmd || 'missing') + '" for which no control functions are mapped.')
    }
    stack = new Stack([uuid, aCmd], funcs, requestData, fakeQC(this), this.options)
    for (event in callbacks) {
        stack.on(event, callbacks[event])
    }
    this.nextTick(stack.go)
    return stack
}
QuickConnect.prototype.handleRequest = handleRequest
QuickConnect.prototype.run = handleRequest

function checkForStack(stackName) {
    return this.mapper.checkForStack(stackName)
}
QuickConnect.prototype.checkForStack = checkForStack

function command(command, callback) {
    return this.mapper.command(command, callback)
}
QuickConnect.prototype.command = command

function isolate(spaces, callback) {
    return this.mapper.isolate(spaces, callback)
}
QuickConnect.prototype.isolate = isolate


exports.QuickConnect = QuickConnect
exports.sharedQC = new QuickConnect