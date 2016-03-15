"use strict";

var path   = require("path"),
  util     = require("util"),
  styles   = require("./styles"),
  getStack = require("./stack"),
  base     = process.cwd(),
  props    = {},
  config;

config = setConfig();

Object.keys(styles)
  .forEach(function (key){
      props[key] = {
          get: function (){
              var s = styles[key];
              this.str = s[0] + this.str + s[1];
              return this;
          }
      };
  });

module.exports = LogColor;
module.exports.setConfig = setConfig;

function LogColor(s) {
    s = s || getTag();
    if (!(this instanceof LogColor)) return new LogColor(s);

    var self = this;

    self.str = " " + String(s);
    self.orig = self.str;

    self.log = function (){
        return self.light_gray.bold.print.apply(self, arguments);
    }

    self.info = function (){
        return self.blue.bold.print.apply(self, arguments);
    }

    self.warn = function (){
        return self.yellow.bold.print.apply(self, arguments);
    }

    self.success = function (){
        return self.green.bold.print.apply(self, arguments);
    }

    self.error = function (){
        return self.red.bold.print.apply(self, arguments);
    }

    self.error_stack = function (){
        var stack = getStack(),
          stackSize = stack.length - 1,
          stackSizeLimit = config.stackSizeLimit,
          mark = ["├─ ", "└─ "];

        stack = stack.slice(1, stackSizeLimit + 1);
        self.red.bold.print.apply(self, arguments);
        for (let i = 0, len = stack.length, st, tag; i < len; i++) {
            st = stack[i];
            tag = "  " + mark[1 - (i < stackSize - 1)] + (stackSize - i - 1);
            new self.constructor(tag).light_red.print(
              "%s:%s <%s>()", st.getFileName(), st.getLineNumber(), st.getFunctionName() || "anonymous"
            );
        }
        if (stackSize > stack.length) {
            new self.constructor("  " + mark[1] + "...").light_red
              .print("more %s", stackSize - stack.length);
        }
    }

    self.print = function (){
        console.log(self.str + " " + util.format.apply(null, arguments));
        self.str = self.orig;
        return self;
    };

    self.toString = function (){
        return self.str;
    };

    Object.defineProperties(self, props);
}

function getTag (){
    var stack  = getStack()[2],
      filename = path.relative(base, stack.getFileName()),
      line     = stack.getLineNumber();
    return config.name + ":" + filename + ":" + line;
}

function setConfig(opt) {
  var opt = opt || {},
    def = {
      name: path.basename(base),
      stackSizeLimit: 20,
    },
    keys = Object.keys(def);

  config = def;

  Object.keys(opt)
    .filter(function (key){
        return keys.indexOf(key) > -1;
    })
    .forEach(function (key){
        config[key] = opt[key];
    });

    return config;
}
