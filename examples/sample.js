var logger = require("../"),
  util = require("util");

/* ~~~~~~~~~~~~~~~~~~~~~~~~ Log / Info / Warn / Error ~~~~~~~~~~~~~~~~~~~~~~~ */

logger().log("Log message")
logger().info("Info message");
logger().success("Success message");
logger().warn("Warn message");
logger().error("Error message");
logger("TAG").info("Optional debug tag");

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ StackTrace Error ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

function_0();

function function_0() {
  function_1();
};

function function_1() {
  function_2();
}

function function_2() {
  try {
    throw new Error("Error message");
  } catch (e) {
    logger().error_stack(e);
  }
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Inheritance ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

var Custom = function (str){
  logger.call(this, str);

  this.new_log = function (){
    this.magenta.print.apply(this, arguments);
  };
};

util.inherits(Custom, logger);

new Custom().new_log("Custom log");
