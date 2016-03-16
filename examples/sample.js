var Logger = require("../"),
  logger = Logger(),
  util = require("util");


console.log("\n\n/* ~~~~~~~~~~~~~~~~~~ Log / Info / Success / Warn / Error ~~~~~~~~~~~~~~~~~~ */\n\n");


logger.log("Log message")
logger.info("Info message");
logger.success("Success message");
logger.warn("Warn message");
logger.error("Error message");


console.log("\n\n/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Instance tag ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */\n\n");

var logTag = Logger("TAG");

logTag.log("Instance with tag");
logTag.info("Instance with tag");
logTag.success("Instance with tag");
logTag.warn("Instance with tag");
logTag.error("Instance with tag");


console.log("\n\n/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ StackTrace ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */\n\n");


function_0();

function function_0() {
    function_1();
};

function function_1() {
    function_2();
}

function function_2() {
    try {
        throw new Error("Error message with stacktrace");
    } catch (e) {
        logger.stack.log("Log message with stacktrace");
        logger.stack.info("Info message with stacktrace");
        logger.stack.success("Success message with stacktrace");
        logger.stack.warn("Warn message with stacktrace");
        logger.stack.error(e);
    }
}


console.log("\n\n/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Custom color ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */\n\n");


logger.gray.print("custom", "Custom color\n");
logger.stack.gray.print("custom", "Custom color with stacktrace");


console.log("\n\n/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Inheritance ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */\n\n");


var Custom = function (str){
    Logger.call(this, str);

    this.new_log = this.debug.bind(this, ["magenta"], "new_log");
};

util.inherits(Custom, Logger);

var customLog = new Custom();
customLog.new_log("Inheritance\n");
customLog.stack.new_log("Inheritance with stacktrace");


console.log("\n\n/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */\n\n");
