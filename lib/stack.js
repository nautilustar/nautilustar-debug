function getStack(){
    var orig, err, stack;
    orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function(_, stack){ return stack; };
    err = new Error;
    Error.captureStackTrace(err, arguments.callee);
    stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
}

module.exports = getStack;
