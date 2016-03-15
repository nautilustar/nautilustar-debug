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

props['stack'] = {
  get: function (){
    this.showStackTrace = true;
    return this;
  }
};

props['nostack'] = {
  get: function (){
    this.showStackTrace = false;
    return this;
  }
};

module.exports = LogColor;
module.exports.setConfig = setConfig;

function LogColor(s) {
    s = s || getTag();
    if (!(this instanceof LogColor)) return new LogColor(s);

    var self = this;

    self.str = " " + String(s);
    self.orig = " " + String(s);
    self.showStackTrace = false;

    self.log = function (){
        self.light_gray.bold.print.apply(self, arguments);
        self.formatStack(new self.constructor("%s").light_gray, getStack());
        return self;
    }

    self.info = function (){
        self.blue.bold.print.apply(self, arguments);
        self.formatStack(new self.constructor("%s").blue, getStack());
        return self;
    }

    self.warn = function (){
        self.yellow.bold.print.apply(self, arguments);
        self.formatStack(new self.constructor("%s").yellow, getStack());
        return self;
    }

    self.success = function (){
        self.green.bold.print.apply(self, arguments);
        self.formatStack(new self.constructor("%s").green, getStack());
        return self;
    }

    self.error = function (){
        self.red.bold.print.apply(self, arguments);
        self.formatStack(new self.constructor("%s").red, getStack());
        return self;
    }

    self.formatStack = function (tag, stack){
        if (!self.showStackTrace) return;

        var stackSize = stack.length - 1,
          stackSizeLimit = config.stackSizeLimit,
          mark = ["├─ ", "└─ "];

        stack = stack.slice(1, stackSizeLimit + 1);
        for (let i = 0, len = stack.length, st; i < len; i++) {
            st = stack[i];
            self.str = util.format(tag.toString(), "  " + mark[1 - (i < stackSize - 1)] + (stackSize - i - 1));
            self.print("%s:%s <%s>()", st.getFileName(), st.getLineNumber(), st.getFunctionName() || "anonymous"
            );
        }
        if (stackSize > stack.length) {
            self.str = util.format(tag.toString(), "  " + mark[1] + "..." + (stackSize - i - 1));
            self.print("more %s", stackSize - stack.length);
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
