"use strict";

var path   = require("path"),
  util     = require("util"),
  styles   = require("./styles"),
  base     = process.cwd(),
  props    = {},
  config;

config = setConfig();

Object.keys(styles)
  .forEach(function (key){
      props[key] = {
          get: function (){
              this.styles.unshift(key);
              return this;
          }
      };
  });

module.exports = LogColor;
module.exports.setConfig = setConfig;

function LogColor(tag) {
    if (!(this instanceof LogColor)) return new LogColor(tag);

    var self = this;

    self.tag = String(tag || "");
    self.showStackTrace = config.showStackTrace;
    self.styles = [];

    self.printStyled = function (tagStyle, name, msg){
        var args = Array.prototype.slice.call(arguments, 2);

        if (!Array.isArray(tagStyle))
            tagStyle = [tagStyle];

        console.log(self.applyStyle(" " + (self.tag || getTag()), tagStyle.reverse()) + " " + util.format.apply(null, args));
        self.formatStack(tagStyle, getStack(msg));

        self.showStackTrace = config.showStackTrace;
        self.styles = [];

        return self;
    };

    self.log = self.printStyled.bind(self, ["bold", "light_gray"], "log");

    self.info = self.printStyled.bind(self, ["bold", "blue"], "info");

    self.warn = self.printStyled.bind(self, ["bold", "yellow"], "warn");

    self.success = self.printStyled.bind(self, ["bold", "green"], "success");

    self.error = self.printStyled.bind(self, ["bold", "red"], "error");

    self.formatStack = function (style, stack){
        if (!self.showStackTrace) return;

        var stackSize = stack.length,
          stackSizeLimit = config.stackSizeLimit,
          mark = ["├─ ", "└─ "],
          prepared = [],
          ignore = ["bold"],
          col = process.stdout.columns;

        stack = stack.slice(0, stackSizeLimit);
        for (let i = 0, len = stack.length; i < len; i++) {
            let st = stack[i],
                info = util.format(" %s:%s <%s>()", st.getFileName(), st.getLineNumber(), st.getFunctionName() || "anonymous"),
                tag = "  " + mark[1 - (i < stackSize - 1)] + (stackSize - i - 1),
                traceCol = col - tag.length;
            if (traceCol < info.length)
                info = " ..." + info.slice(0 - (traceCol - 4));
            prepared.push(self.applyStyle(tag, style, ignore) + info);
        }
        if (stackSize > stack.length) {
            prepared.push(self.applyStyle("  " + mark[1] + "...", style, ignore) +
                util.format(" more %s", stackSize - stack.length));
        }
        console.log(prepared.join("\n") + "\n");
    }

    self.print = function (name, msg){
        return self.printStyled.bind(self, self.styles).apply(self, arguments);
    };

    self.applyStyle = function (str, arrStyle, ignore){
        ignore = ignore || [];
        arrStyle.forEach(function (s){
            if (ignore.indexOf(s) == -1)
                str = styles[s][0] + str + styles[s][1];
        });
        return str + styles.normal[0];
    };

    self.toString = function (){
        return self.tag;
    };

    Object.defineProperties(self, props);

    Object.defineProperties(self, {
        "stack": {
            get: function (){
                this.showStackTrace = true;
                return this;
            }
        },
        "nostack": {
            get: function (){
                this.showStackTrace = false;
                return this;
            }
        },
    });
}

function getTag (){
    var stack  = getStack()[0],
      filename = path.relative(base, stack.getFileName()),
      line     = stack.getLineNumber();
    return config.name + ":" + filename + ":" + line;
}

function getStack(err){
    var orig, err, stack;
    orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function(_, stack){ return stack; };
    err = err instanceof Error ? err : new Error;
    Error.captureStackTrace(err, getStack);
    stack = err.stack;
    Error.prepareStackTrace = orig;

    while (true) {
        if (stack[0] && stack[0].getFileName() === __filename) {
          stack.shift();
          continue;
        }
        return stack;
    }
}

function setConfig(opt) {
  var opt = opt || {},
    def = {
      name: path.basename(base),
      stackSizeLimit: 20,
      showStackTrace: false,
    },
    keys = Object.keys(def);

  config = config || def;

  Object.keys(opt)
    .filter(function (key){
        return keys.indexOf(key) > -1;
    })
    .forEach(function (key){
        config[key] = opt[key];
    });

    return config;
}
