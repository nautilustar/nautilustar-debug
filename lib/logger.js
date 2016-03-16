"use strict";

var path = require("path"),
  util     = require("util"),
  styles   = require("./styles"),
  base     = process.cwd(),
  config;

config = setConfig();

module.exports = Logger;
module.exports.setConfig = setConfig;

function Logger (name) {
    if (!(this instanceof Logger)) return new Logger(name);

    var self = this,
      showStackTrace = config.showStackTrace,
      style = [], log = {name: String(name || "")}, props = {};

    self.debug = function debug (style, type, msg /*, ..., ...*/){
        var args = Array.prototype.slice.call(arguments, 2),
          stacktrace;
        log.type = type;
        if (!name) {
            stacktrace = getStackTrace(msg);
            log.name = formatName(stacktrace[0]);
        }
        log.stacktrace = showStackTrace ? (stacktrace || getStackTrace(msg)) : [];
        log.message = util.format.apply(util, args);
        log.date = new Date();

        self.toConsole(log, style);
        self.toLogFile(log);

        showStackTrace = config.showStackTrace;
        style = [];
    };

    self.log = self.debug.bind(self, ["bold", "light_gray"], "log");

    self.info = self.debug.bind(self, ["bold", "blue"], "info");

    self.warn = self.debug.bind(self, ["bold", "yellow"], "warn");

    self.success = self.debug.bind(self, ["bold", "green"], "success");

    self.error = self.debug.bind(self, ["bold", "red"], "error");

    self.print = function (name, msg){
        return self.debug.bind(self, style).apply(self, arguments);
    };

    self.toConsole = function toConsole (log, style){
        var toWrite = [
            " " + applyStyle(log.name, style),
            " " + log.message + "\n",
        ],
        symbols = ["├─ ", "└─ "];
        
        if (log.stacktrace.length) {
            style = style ?
              style.filter(function (s){ return s !== "bold";}) : [];
            var marker = applyStyle("  %s %s ", style),
              trace = "%s:%s <%s>()",
              col = process.stdout.columns || 80;
            for (let i = 0, len = log.stacktrace.length, mksize = 8, line, stack; i < len; i++) {
                if (i === config.stackSizeLimit) {
                    toWrite.push(util.format(marker + "more %s", symbols[1], "...", len - i));
                    break;
                }
                stack = log.stacktrace[i];
                line = util.format(trace, stack.filename, stack.line, stack.function);
                if (col < line.lenght + mksize)
                    line = "..." + line.slice(0 - (col - mksize - 3));
                toWrite.push(util.format(marker, symbols[1 - (i < len -1)], stack.pos) + line + "\n");
            }
        }

        process.stdout.write(toWrite.join(""));
    };

    self.toLogFile = function toLogFile (log){
        //
    };

    Object.keys(styles)
      .forEach(function (key){
          props[key] = {
              get: function (){
                  style.push(key);
                  return this;
              }
          };
      });

    Object.defineProperties(self, props);

    Object.defineProperties(self, {
        "stack": {
            get: function (){
                showStackTrace = true;
                return this;
            }
        },
        "nostack": {
            get: function (){
                showStackTrace = false;
                return this;
            }
        },
    });

    function formatName(stacktrace) {
        return util.format("%s:%s:%s",
            config.app_name,
            path.relative(base, stacktrace.filename),
            stacktrace.line
        );
    }

    function applyStyle(str, arrStyle){
        arrStyle = arrStyle || [];

        arrStyle.forEach(function (s){
            str = styles[s][0] + str + styles[s][1];
        });
        return str + styles.normal[0];
    };

    function getStackTrace(err) {
        var rm = true,
          orig, err, stack, lastIndex;
        orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function(_, stack){ return stack; };
        err = err instanceof Error ? err : new Error;
        Error.captureStackTrace(err, getStackTrace);
        stack = err.stack;
        Error.prepareStackTrace = orig;

        stack = stack
          .filter(function (st){
              return !(rm = rm && st.getFileName() === __filename);
          });

        lastIndex = stack.length - 1;

        stack = stack.map(function (st, index){
              return {
                  "pos": lastIndex - index,
                  "filename": st.getFileName(),
                  "line": st.getLineNumber(),
                  "function": st.getFunctionName(),
              };
          });

        return stack;
    }
};

function setConfig(opt) {
    var opt = opt || {},
      def = {
        app_name: path.basename(base),
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
