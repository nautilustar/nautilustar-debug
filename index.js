var path  = require("path"),
  util    = require("util"),
  base    = process.cwd(),

  styles = {
    normal: [0, 0],
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    strikethrough: [9, 29],

    default: [39, 39],
    black: [30, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    light_gray: [37, 39],
    dark_gray: [90, 39],
    light_red: [91, 39],
    light_green: [92, 39],
    light_yellow: [93, 39],
    light_blue: [94, 39],
    light_magenta: [95, 39],
    light_cyan: [96, 39],
    white: [97, 39],
  };

function LogColor(s) {
    if (!(this instanceof LogColor)) return new LogColor(s);

    var self = this;

    self.str = " " + String(s);
    self.orig = self.str;

    self.log = function (){
        // self.str = "[LOG]" + self.orig;
        self.light_gray.bold.print.apply(self, arguments);
    }

    self.info = function (){
        // self.str = "[INFO]" + self.orig;
        self.blue.bold.print.apply(self, arguments);
    }

    self.warn = function (){
        // self.str = "[WARN]" + self.orig;
        self.yellow.bold.print.apply(self, arguments);
    }

    self.success = function (){
        // self.str = "[SUCCESS]" + self.orig;
        self.green.bold.print.apply(self, arguments);
    }

    self.error = function (err){
        // self.str = "[ERROR]" + self.orig;
        var stack, mark;
        if (err instanceof Error) {
            self.red.bold.print.call(self, "[%s] %s", err.name, err.message);
            stack = Array.prototype.slice.call(getStack() || [], 1, 25);
            for (var i = 0, len = stack.length; i < len; i++) {
                mark = i < len - 1 ? "├─" : "└─";
                LogColor("  " + mark).light_red.print("%s:%s <%s>()", stack[i].getFileName(),
                    stack[i].getLineNumber(), stack[i].getFunctionName() || "anonymous");
            }
        } else
            self.red.bold.print.apply(self, arguments);
    }

    self.print = function (){
        console.log(self.str + " " + util.format.apply(null, arguments));
        self.str = self.orig;
    };

    self.toString = function (){
        return this.str;
    };

    Object.keys(styles).forEach(function (key){
        Object.defineProperty(self, key, {
            get: function (){
                var s = styles[key];
                self.str = '\u001b[' + s[0] + 'm' + self.str + '\u001b[' + s[1] + 'm';
                return self;
            }
        });
    });
}

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

function debug (debugTag) {
   if (!debugTag) {
    var stack   = getStack(),
      filename  = path.relative(base, stack[1].getFileName()),
      line      = stack[1].getLineNumber(),
      debugTag = module.exports.app_name + ":" + filename + ":" + line;
    }
    return LogColor(debugTag);
};

module.exports = debug;
module.exports.app_name = path.basename(base);
module.exports.LogColor = LogColor;
