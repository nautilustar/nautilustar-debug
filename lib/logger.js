"use strict";

var fs      = require("fs"),
  path      = require("path"),
  util      = require("util"),
  callsites = require("./error-callsites"),
  styles    = require("./styles"),
  base      = process.cwd(),
  config;

config = setConfig();

module.exports = Logger;
module.exports.setConfig = setConfig;

function Logger (name) {
    if (!(this instanceof Logger)) return new Logger(name);

    var self = this;

    this.style = [];
    this.showStackTrace = config.show_stack_trace;

    self.print = function print (style, level, msg /*, ..., ...*/){
        var args = Array.prototype.slice.call(arguments, 2),
          showStackTrace = self.showStackTrace || level == 'trace',
          log = {},
          stacktrace;

        self.showStackTrace = config.show_stack_trace;

        log.level = level;
        log.date = new Date();

        if (!name) {
            stacktrace = getStackTrace(msg);
            log.name = formatName(stacktrace[0]);
        } else {
            log.name = String(name);
        }
        log.stacktrace = showStackTrace ? (stacktrace || getStackTrace(msg)) : [];
        log.message = util.format.apply(util, args);

        self.toConsole(log, style);

        process.nextTick(self.toLogFile.bind(log));

    };

    self.debug = self.print.bind(self, ["bold", "light_gray"], "debug");

    self.log = self.print.bind(self, ["bold", "light_gray"], "log");

    self.info = self.print.bind(self, ["bold", "blue"], "info");

    self.warn = self.print.bind(self, ["bold", "yellow"], "warn");

    self.success = self.print.bind(self, ["bold", "green"], "success");

    self.error = self.print.bind(self, ["bold", "red"], "error");

    self.trace = self.print.bind(self, ["bold", "red"], "trace");

    self.toConsole = function toConsole (log, style){
        var toWrite = [
            " " + applyStyle(log.name, style),
            " " + log.message + "\n",
          ],
          symbols = ["├─", "└─"];

        if (log.stacktrace.length) {
            style = style ?
              style.filter(function (s){ return s !== "bold";}) : [];
            var marker = applyStyle("  %s %s ", style),
              trace = "%s:%s <%s>()",
              col = process.stdout.columns || 80;
            for (let i = 0, len = log.stacktrace.length, mksize = 8, line, stack; i < len; i++) {
                if (i === config.stack_size_limit) {
                    toWrite.push(util.format(marker + "more %s\n", symbols[1], "...", len - i));
                    break;
                }
                stack = log.stacktrace[i];
                line = util.format(trace, stack.filename, stack.line, stack.function);
                if (col < line.length + mksize)
                    line = "..." + line.slice(0 - (col - mksize - 3));
                toWrite.push(util.format(marker, symbols[1 - (i < len -1)], stack.pos) + line + "\n");
            }
        }

        process.stdout.write(toWrite.join(""));
    };

    self.toLogFile = function toLogFile (log){
        // TODO output log to file
    };

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
          stack = callsites(err instanceof Error ? err : new Error()),
          lastIndex;

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
                  "function": st.getFunctionName() || "anonymous",
              };
          });

        return stack;
    }
};

Object.keys(styles)
  .forEach(function (key){
      Object.defineProperty(Logger.prototype, key, {
          get: function (){
              this.style.push(key);
              return this;
          }
      });
  });

Object.defineProperties(Logger.prototype, {
    stack: {
        get: function (){
            this.showStackTrace = true;
            return this;
        }
    },
    nostack: {
        get: function (){
            this.showStackTrace = false;
            return this;
        }
    }
});

function setConfig(opt) {
    var opt = opt || {},
      def = {
        app_name: path.basename(base),
        stack_size_limit: 10,
        show_stack_trace: false,
        log_directory: null,
        max_log_size: "5M",
        file_log_prefix: null,
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
