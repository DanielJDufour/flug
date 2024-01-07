// in the browser, require returns an empty object
const env = typeof window === "object" ? "browser" : "node";

if (env === "browser") {
  window.require = () => ({});
  window.process = { env: {} };
}

const { deepStrictEqual } = require("assert");
const { readFileSync } = require("fs");

const DEEP_STRICT_EQUAL_ERROR_MESSAGE = "AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:";
const TIME_MS = 250;
const COLORS = { BLUE: "\x1b[34m", GREEN: "\x1b[32m", YELLOW: "\x1b[33m", PURPLE: "\x1b[35m", RED: "\x1b[31m", OFF: "\x1B[39m" };
const PLUS = COLORS.YELLOW + "+" + COLORS.OFF;
const MINUS = COLORS.PURPLE + "-" + COLORS.OFF;

/** print out caller file path on top of each */
const queue = [];
const complete = [];

const run = async ({ name, cb, caller }) => {
  let savedActual, savedExpected;
  const eq = function (actual, expected) {
    if (arguments.length === 1) {
      throw new Error("[flug] you only supplied one argument");
    }
    savedActual = actual;
    savedExpected = expected;
    if (deepStrictEqual) {
      return deepStrictEqual(actual, expected);
    } else if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      console.log("%c failed: " + name, "color: red");
      console.log("%c\texpected:", "color: purple", expected);
      console.log("%c\treceived:", "color: rgb(200, 200, 0)", actual);
      throw new Error("");
    }
  };

  try {
    const start_time = performance.now();
    await Promise.resolve(cb({ eq }));
    if (caller !== complete[complete.length - 1]) {
      // console.log("\n\n" + caller.split(":")[0]);
    }
    const end_time = performance.now();
    const test_time = Math.round(end_time - start_time).toLocaleString() + "ms";
    const TIMED = ["True", "TRUE", "true", "t", "1", "", true, 1].includes(process.env.TEST_TIMED);
    if (env === "browser") {
      console.log("%c success" + (TIMED ? " (" + test_time + ")" : "") + ": " + name, "color: green");
    } else {
      console.log(COLORS.GREEN + "%s\x1b[0m", "success" + (TIMED ? " (" + test_time + ")" : "") + ": " + name);
    }
  } catch (error) {
    console.error("\n" + COLORS.RED + "%s\x1b[0m", "failed: " + name);
    let msg = error.toString();

    const stack_lines = typeof error.stack === "string" ? error.stack.split("\n") : [];
    const filtered_lines = stack_lines
      .slice(
        stack_lines.findIndex(ln => ln.trim().startsWith("at")),
        stack_lines.findIndex(ln => ln.includes("node:internal"))
      )
      .filter(ln => !ln.includes("flug/index") && !ln.includes("runMicrotasks (<anonymous>)"));
    const new_stack = filtered_lines.join("\n");

    if (msg.startsWith(DEEP_STRICT_EQUAL_ERROR_MESSAGE)) {
      let output;
      output = msg.split("\n").slice(3).join("\n").replaceAll("\x1B[32m+\x1B[39m", `    ${PLUS}:`).replaceAll("\x1B[31m-\x1B[39m", `    ${MINUS}:`);

      let stringable = false;
      try {
        stringable = JSON.stringify(savedActual).length < 200 && JSON.stringify(savedExpected).length < 200;
      } catch (error) {}
      if (stringable) {
        output = `${COLORS.PURPLE}expected:${COLORS.OFF} ${JSON.stringify(savedExpected)}\n${COLORS.YELLOW}received:${COLORS.OFF} ${JSON.stringify(savedActual)}\n`;
      } else if (`${savedActual}`.indexOf("[object") === -1 && `${savedExpected}`.indexOf("[object") === -1) {
        output = `${COLORS.PURPLE}expected:${COLORS.OFF} ${savedExpected}\n${COLORS.YELLOW}received:${COLORS.OFF} ${savedActual}\n`;
      } else if (output.includes(PLUS) || output.includes(MINUS)) {
        output += `\nkey:   ${COLORS.YELLOW}received +${COLORS.OFF}   ${COLORS.PURPLE}expected: -${COLORS.OFF}\n`;
      }

      try {
        const ln = filtered_lines[0];
        const [filepath, row, col] = ln.replace("at", "").trim().split(":");
        const text = readFileSync(filepath, "utf-8")
          .split(/\n\r?/g)
          [row - 1].substring(col - 1);
        output += `${COLORS.BLUE}line:${COLORS.OFF} "${text}"`;
      } catch (e) {
        // pass
      }
      output += "\n\n";
      if (new_stack.length > 0) {
        output += new_stack;
        output += "\n\n";
      }
      console.error(output);
    } else {
      let output = msg;
      output += "\n\n";
      if (new_stack.length > 0) {
        output += new_stack;
        output += "\n\n";
      }
      console.error(output);
    }
    if (env === "node") {
      process.exit(1);
    }
  }
};

const skip = name => {
  if (!["false", "False", "FALSE", "0"].includes(process.env.LOG_SKIP)) {
    if (env === "browser") {
      console.log("%c skipped: " + name, "color: rgb(200, 200, 0)");
    } else {
      console.log(COLORS.YELLOW + "skipped: " + name + COLORS.OFF);
    }
  }
};

const test = (name, cb) => {
  let caller;
  try {
    const lines = Error().stack.split(/ *\n\r? */g);
    const ln = lines[2];
    if (env === "browser") {
      // in Browser, at http://localhost:8080/test.html:8:12
      caller = ln.replace("at ", "").trim();
    } else {
      // in NodeJS, at Object.<anonymous> (/path/to/file.js:3:1)
      caller = ln.substring(ln.indexOf("(") + 1, ln.lastIndexOf(")"));
    }
  } catch (error) {
    caller = undefined;
  }

  if (process.env.TEST_NAME) {
    const testName = process.env.TEST_NAME.trim();
    if (testName.includes("*")) {
      const re = new RegExp("^" + testName.replace(/\./g, "\\.").replace(/\*/g, ".*").replace(/\[/, "\\[").replace(/\]/, "\\]") + "$", "g");
      if (!re.test(name)) {
        return skip(name);
      }
    } else if (testName !== name) {
      return skip(name);
    }
  }

  if (process.env.TEST_FILE || process.env.TEST_DIR) {
    if ((process.env.TEST_FILE && process.env.TEST_FILE !== caller.split("/").slice(-1)[0].split(":")[0]) || (process.env.TEST_DIR && process.env.TEST_DIR !== caller.split("/").slice(-2, -1)[0])) return skip(name);
  }

  queue.push({ name, caller });

  const proceed = async () => {
    if (queue[0].name === name) {
      await Promise.resolve(run({ name, cb, caller }));
      complete.push(queue.shift()); // remove first test in queue
    } else {
      setTimeout(proceed, TIME_MS);
    }
  };
  setTimeout(proceed, TIME_MS);

  // checkQueue keeps the main thread alive
  // until the queue is complete
  const checkQueue = () => {
    if (queue.length > 0) {
      setTimeout(checkQueue, TIME_MS);
    }
  };
  checkQueue();
};

if (typeof define === "function" && define.amd) {
  define(function () {
    return test;
  });
}

if (typeof module === "object") {
  // seem to be in NodeJS
  module.exports = test;
  module.exports.default = test;
}

if (typeof window == "object") {
  // seem to be in a browser
  window.flug = { test };
}
