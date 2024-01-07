// using NodeJS' assert library to test flug
const assert = require("node:assert");
const child_process = require("node:child_process");
const fs = require("node:fs");

const $ = str => {
  try {
    const output = child_process
      .execSync(str + " 2>&1", {
        cwd: __dirname,
        stdio: [0, fs.openSync("log.out", "w"), fs.openSync("err.out", "w")]
      })
      .toString();
    return output;
  } catch (error) {
    const msg = fs.readFileSync("log.out", "utf-8");
    return msg;
  }
};

const t = (cmd, expected) => {
  const out = $(cmd);
  if (expected instanceof RegExp) {
    if (out.match(expected)) {
      console.log("\x1B[32msuccessfully\x1B[0m ran " + cmd);
    } else {
      console.log("out:", [out]);
      throw new Error("failed");
    }
  } else {
    try {
      assert.strictEqual(out, expected);
      console.log("\x1B[32msuccessfully\x1B[0m ran " + cmd);
    } catch (error) {
      console.log("out:", [out]);
      throw error;
    }
  }
};

t("node ./examples/test.addition.js", "\x1B[32msuccess: addition\x1B[0m\n");
t("TEST_NAME='  addition ' node ./examples/test.addition.js", "\x1B[32msuccess: addition\x1B[0m\n");
t("node ./examples/test.error.js", "\n\x1B[31mfailed: error\x1B[0m\nerror\n\n\n");

const cmd = "node ./examples/test.failure.js";
const log = $(cmd).trim().replace(/\n/g, "");
assert.strictEqual(log.includes("failed: failure"), true); // includes failure message with test name
assert.strictEqual(log.includes("at "), true); // include stack trace
assert.strictEqual(log.includes("test.failure.js"), true);
console.log("\x1B[32msuccessfully\x1B[0m ran " + cmd);

t("node ./examples/test.timed.js", /\x1B\[32msuccess \((0|1)ms\)\: timed\x1B\[0m\n/);

t("node ./examples/test.queue.js", "\x1B[32msuccess: first\x1B[0m\n\x1B[32msuccess: second\x1B[0m\n\x1B[32msuccess: third\x1B[0m\n");

t("node ./examples/test.filename.js", "\x1B[33mskipped: invalid filename\x1B[39m\n\x1B[32msuccess: valid filename\x1B[0m\n");

t("node ./examples/test.dir.js", "\x1B[33mskipped: invalid dir\x1B[39m\n\x1B[32msuccess: valid dir\x1B[0m\n");

t("node ./examples/test.name.js", "\x1B[33mskipped: skip\x1B[39m\n\x1B[32msuccess: only\x1B[0m\n");

t("node ./examples/test.name-wildcard.js", "\x1B[33mskipped: skip\x1B[39m\n\x1B[32msuccess: only[this]\x1B[0m\n");

const cmd2 = "node ./examples/test.only-one-arg.js";
const log2 = $(cmd2).trim().replace(/\n/g, "");
assert.strictEqual(log2.includes("you only supplied one argument"), true);
