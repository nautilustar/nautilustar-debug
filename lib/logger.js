"use strict";

var path = require("path"),
    util = require("util"),
    callsites = require("./error-callsites"),
    styles = require("./styles"),
    base = process.cwd();

const Level = {};
Level.NONE = 0;
Level.ERROR = 1;
Level.WARN = 3;
Level.INFO = 7;
Level.LOG = 15;
Level.DEBUG = 31;
Level.TRACE = 63;
Level.ALL = 61;

module.exports.createLogger = Logger;
module.exports.Level = Level;

function Logger(name, config) {
    if (!(this instanceof Logger)) return new Logger(name, config);

    const self = this;

    this.config = parseConfig(config);
    this.style = [];
    this.showStackTrace = self.config.show_stack_trace;

    self.print = function print(style, level, msg /*, ..., ...*/) {
        let isLoggable = (self.config.level & level) == level;
        if (!isLoggable) {
            /*console.log("config: %s, print: %s, result: %s, isLoggable: %s",
                self.config.level, level, self.config.level & level, isLoggable);*/
            return false;
        }

        var args = Array.prototype.slice.call(arguments, 2),
            showStackTrace = self.showStackTrace || level == 'trace',
            log = {},
            stacktrace;

        self.showStackTrace = self.config.show_stack_trace;

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

    self.debug = self.print.bind(self, ["bold", "dark_gray"], Level.DEBUG);

    self.log = self.print.bind(self, ["bold", "light_gray"], Level.LOG);

    self.info = self.print.bind(self, ["bold", "blue"], Level.INFO);

    self.warn = self.print.bind(self, ["bold", "yellow"], Level.WARN);

    self.success = self.print.bind(self, ["bold", "green"], Level.ALL);

    self.error = self.print.bind(self, ["bold", "red"], Level.ERROR);

    self.trace = self.print.bind(self, ["bold", "red"], Level.TRACE);

    self.toConsole = function toConsole(log, style) {
        var toWrite = [
            " " + applyStyle(log.name, style),
            " " + log.message + "\n",
        ],
            symbols = ["├─", "└─"];

        if (log.stacktrace.length) {
            style = style ?
                style.filter(function (s) { return s !== "bold"; }) : [];
            var marker = applyStyle("  %s %s ", style),
                trace = "%s:%s <%s>()",
                col = process.stdout.columns || 80;
            for (let i = 0, len = log.stacktrace.length, mksize = 8, line, stack; i < len; i++) {
                if (i === self.config.stack_size_limit) {
                    toWrite.push(util.format(marker + "more %s\n", symbols[1], "...", len - i));
                    break;
                }
                stack = log.stacktrace[i];
                line = util.format(trace, stack.filename, stack.line, stack.function);
                if (col < line.length + mksize)
                    line = "..." + line.slice(0 - (col - mksize - 3));
                toWrite.push(util.format(marker, symbols[1 - (i < len - 1)], stack.pos) + line + "\n");
            }
        }

        process.stdout.write(toWrite.join(""));
    };

    self.toLogFile = function toLogFile(log) {
        // TODO output log to file
    };

    function formatName(stacktrace) {
        return util.format("%s:%s:%s",
            self.config.app_name,
            path.relative(base, stacktrace.filename),
            stacktrace.line
        );
    }

    function applyStyle(str, arrStyle) {
        arrStyle = arrStyle || [];

        arrStyle.forEach(function (s) {
            str = styles[s][0] + str + styles[s][1];
        });
        return str + styles.normal[0];
    };

    function getStackTrace(err) {
        var rm = true,
            stack = callsites(err instanceof Error ? err : new Error()),
            lastIndex;

        stack = stack
            .filter(function (st) {
                return !(rm = rm && st.getFileName() === __filename);
            });

        lastIndex = stack.length - 1;

        stack = stack.map(function (st, index) {
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
    .forEach(function (key) {
        Object.defineProperty(Logger.prototype, key, {
            get: function () {
                this.style.push(key);
                return this;
            }
        });
    });

Object.defineProperties(Logger.prototype, {
    stack: {
        get: function () {
            this.showStackTrace = true;
            return this;
        }
    },
    nostack: {
        get: function () {
            this.showStackTrace = false;
            return this;
        }
    }
});

function parseConfig(opt) {
    var opt = opt || {},
        config = {
            app_name: path.basename(base),
            stack_size_limit: 10,
            show_stack_trace: false,
            log_directory: null,
            max_log_size: "5M",
            file_log_prefix: null,
            level: Level.ERROR,
        },
        keys = Object.keys(config);

    Object.keys(opt)
        .filter(function (key) {
            return keys.indexOf(key) > -1;
        })
        .forEach(function (key) {
            config[key] = opt[key];
        });

    return config;
}
