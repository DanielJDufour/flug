const { deepStrictEqual } = require("assert");
const { readFileSync } = require("fs");

const DEEP_STRICT_EQUAL_ERROR_MESSAGE = "AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:";

const TIME_MS = 250;

const queue = [];

const COLOR_BLUE = "\x1b[34m";
const COLOR_YELLOW = "\x1b[33m";
const COLOR_PURPLE = "\x1b[35m";
const NO_COLOR = "\x1B[39m";

const PLUS = COLOR_YELLOW + "+" + NO_COLOR;
const MINUS = COLOR_PURPLE + "-" + NO_COLOR;

const run = async (name, cb) => {
  let savedActual, savedExpected;
  const eq = (actual, expected) => {
    savedActual = actual;
    savedExpected = expected;
    return deepStrictEqual(actual, expected);
  };

  try {
    await Promise.resolve(cb({ eq }));
    console.log("\x1b[32m%s\x1b[0m", "success: " + name);
  } catch (error) {
    console.error("\n\x1b[31m%s\x1b[0m", "failed: " + name);
    let msg = error.toString();
    if (msg.startsWith(DEEP_STRICT_EQUAL_ERROR_MESSAGE)) {
      let output;
      output = msg
        .split("\n")
        .slice(3) // remove first three lines
        .join("\n")
        .replaceAll("\x1B[32m+\x1B[39m", `    ${PLUS}:`)
        .replaceAll("\x1B[31m-\x1B[39m", `    ${MINUS}:`);

      let stringable = false;
      try {
        stringable = JSON.stringify(savedActual).length < 200 && JSON.stringify(savedExpected).length < 200;
      } catch (error) {}
      if (stringable) {
        output = `${COLOR_PURPLE}expected:${NO_COLOR} ${JSON.stringify(savedExpected)}\n${COLOR_YELLOW}received:${NO_COLOR} ${JSON.stringify(savedActual)}\n`;
      } else if (output.includes(PLUS) || output.includes(MINUS)) {
        output += `\nkey:   ${COLOR_YELLOW}received +${NO_COLOR}   ${COLOR_PURPLE}expected: -${NO_COLOR}\n`;
      }

      const stack_lines = error.stack.split("\n");
      const filtered_lines = stack_lines
        .slice(
          stack_lines.findIndex(ln => ln.trim().startsWith("at")),
          stack_lines.findIndex(ln => ln.includes("node:internal"))
        )
        .filter(ln => !ln.includes("flug/index") && !ln.includes("runMicrotasks (<anonymous>)"));

      try {
        const ln = filtered_lines[0];
        const [filepath, row, col] = ln.replace("at", "").trim().split(":");
        const text = readFileSync(filepath, "utf-8")
          .split(/\n\r?/g)
          [row - 1].substring(col - 1);
        output += `${COLOR_BLUE}line:${NO_COLOR} "${text}"`;
      } catch (error) {}
      output += "\n\n";
      output += filtered_lines.join("\n");
      output += "\n\n";
      console.error(output);
    } else {
      console.error(error);
    }
  }
};

const test = (name, cb) => {
  queue.push(name);
  if (!process.env.TEST_NAME || process.env.TEST_NAME === name) {
    const process = () => {
      if (queue[0] === name) {
        Promise.resolve(run(name, cb)).then(() => {
          queue.shift(); // remove first test in queue
        });
      } else {
        setTimeout(process, TIME_MS);
      }
    };
    setTimeout(process, TIME_MS);
  }
};

module.exports = test;
