const { deepStrictEqual } = require("assert");
const { readFileSync } = require("fs");

const DEEP_STRICT_EQUAL_ERROR_MESSAGE = "AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:";
const TIME_MS = 250;
const COLORS = { BLUE: "\x1b[34m", GREEN: "\x1b[32m", YELLOW: "\x1b[33m", PURPLE: "\x1b[35m", RED: "\x1b[31m", OFF: "\x1B[39m" };
const PLUS = COLORS.YELLOW + "+" + COLORS.OFF;
const MINUS = COLORS.PURPLE + "-" + COLORS.OFF;

const queue = [];

const run = async (name, cb) => {
  let savedActual, savedExpected;
  const eq = (actual, expected) => {
    savedActual = actual;
    savedExpected = expected;
    return deepStrictEqual(actual, expected);
  };

  try {
    await Promise.resolve(cb({ eq }));
    console.log(COLORS.GREEN + "%s\x1b[0m", "success: " + name);
  } catch (error) {
    console.error("\n" + COLORS.RED + "%s\x1b[0m", "failed: " + name);
    let msg = error.toString();
    if (msg.startsWith(DEEP_STRICT_EQUAL_ERROR_MESSAGE)) {
      let output;
      output = msg.split("\n").slice(3).join("\n").replaceAll("\x1B[32m+\x1B[39m", `    ${PLUS}:`).replaceAll("\x1B[31m-\x1B[39m", `    ${MINUS}:`);

      let stringable = false;
      try {
        stringable = JSON.stringify(savedActual).length < 200 && JSON.stringify(savedExpected).length < 200;
      } catch (error) {}
      if (stringable) {
        output = `${COLORS.PURPLE}expected:${COLORS.OFF} ${JSON.stringify(savedExpected)}\n${COLORS.YELLOW}received:${COLORS.OFF} ${JSON.stringify(savedActual)}\n`;
      } else if (output.includes(PLUS) || output.includes(MINUS)) {
        output += `\nkey:   ${COLORS.YELLOW}received +${COLORS.OFF}   ${COLORS.PURPLE}expected: -${COLORS.OFF}\n`;
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
        output += `${COLORS.BLUE}line:${COLORS.OFF} "${text}"`;
      } catch (error) {}
      output += "\n\n";
      output += filtered_lines.join("\n");
      output += "\n\n";
      console.error(output);
    } else {
      console.error(error);
    }
    process.exit();
  }
};

const skip = name => console.log(COLORS.YELLOW + "skipped: " + name + COLORS.OFF);

const test = (name, cb) => {
  if (process.env.TEST_NAME && process.env.TEST_NAME !== name) return skip(name);

  if (process.env.TEST_FILE || process.env.TEST_DIR) {
    const ln = Error().stack.split(/ *\n\r? */g)[2];
    const fp = ln.substring(ln.indexOf("(") + 1, ln.lastIndexOf(")")).split("/");
    if ((process.env.TEST_FILE && process.env.TEST_FILE !== fp.slice(-1)[0].split(":")[0]) || (process.env.TEST_DIR && process.env.TEST_DIR !== fp.slice(-2, -1)[0])) return skip(name);
  }

  queue.push(name);

  const proceed = async () => {
    if (queue[0] === name) {
      await Promise.resolve(run(name, cb));
      queue.shift(); // remove first test in queue
    } else {
      setTimeout(proceed, TIME_MS);
    }
  };
  setTimeout(proceed, TIME_MS);
};

module.exports = test;
