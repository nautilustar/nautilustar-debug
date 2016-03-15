var logger = require("../");

logger().log("Log message");
logger().info("Info message");
logger().success("Success message");
logger().warn("Warn message");
logger().error("Error message");

logger("TAG").info("Optional debug tag");
logger().error(new Error("Show stacktrace"));

step0();

function step0() {
  step1();
};

function step1() {
  step2();
}

function step2() {
  try {
    JSON.parse("{-}");
  } catch (e) {
    logger("Show stacktrace").error(e);
  }
}
