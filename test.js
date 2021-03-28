// using NodeJS' assert library to test fast-test
const assert = require("assert");
const child_process = require("child_process");

assert.strictEqual(
  child_process.execSync("node ./examples/test.addition.js 2>&1", { cwd: __dirname }).toString(),
  "\x1B[32msuccess: addition\x1B[0m\n"
);

assert.strictEqual(
  child_process.execSync("node ./examples/test.error.js 2>&1", { cwd: __dirname }).toString(),
  "\n\x1B[31mfailed: error\x1B[0m\nerror\n"
);

const log = child_process.execSync("node ./examples/test.failure.js 2>&1", { cwd: __dirname }).toString().trim().replace(/\n/g,"");
assert.strictEqual(log.includes("failed: failure"), true); // includes failure message with test name
assert.strictEqual(log.includes("at "), true); // include stack trace
assert.strictEqual(log.includes("test.failure.js"), true);
