var logger = require("../"),
  util = require("util");

/* ~~~~~~~~~~~~~~~~~~~~~~~ Log / Info / Warn / Error ~~~~~~~~~~~~~~~~~~~~~~~ */

logger().log("Log message")
logger().info("Info message");
logger().success("Success message");
logger().warn("Warn message");
logger().error("Error message");
logger("TAG").info("Optional debug tag");

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ StackTrace ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

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
        logger().stack.error(e);
    }
    logger().stack.warn("Warn with stacktrace");
    logger().stack.info("Info with stacktrace");
    logger().stack.success("Success with stacktrace");
    logger().stack.log("Log with stacktrace");
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Inheritance ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

var Custom = function (str){
  logger.call(this, str);

  this.new_log = function (){
    this.magenta.print.apply(this, arguments);
  };
};

util.inherits(Custom, logger);

new Custom().new_log("Custom log");
