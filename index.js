const { deepStrictEqual } = require("assert");

const DEEP_STRICT_EQUAL_ERROR_MESSAGE = "AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:";

const test = (name, cb) => {
  if (!process.env.TEST_NAME || process.env.TEST_NAME === name) {
    try {
      cb({ eq: deepStrictEqual });
      console.log("\x1b[32m%s\x1b[0m", "success: " + name);
    } catch (error) {
      console.error("\n\x1b[31m%s\x1b[0m", "failed: " + name);
      let msg = error.toString();
      if (msg.startsWith(DEEP_STRICT_EQUAL_ERROR_MESSAGE)) {
        // console.log({msg});
        // console.log({stack: error.stack});
        let output;
        // const output = msg.replace(DEEP_STRICT_EQUAL_ERROR_MESSAGE, "");
        output = msg.split("\n")
          .slice(3) // remove first three lines
          .join("\n")
          .replace("\x1B[32m+\x1B[39m", "    received:")
          .replace("\x1B[31m-\x1B[39m", "    expected:");

        output += "\n";

        const stack_lines = error.stack.split("\n");
        const filtered_lines = stack_lines.slice(
          stack_lines.findIndex(ln => ln.trim().startsWith("at")),
          stack_lines.findIndex(ln => ln.includes("node:internal"))
        ).join("\n");
        output += filtered_lines;
          
        output += "\n\n";
        console.error(output);
      } else {
        console.error(error);
      }
    }
  }
}

module.exports = test;
