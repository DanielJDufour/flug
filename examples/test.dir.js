const test = require("../index.js");

process.env.TEST_DIR = "examples";
test("valid dir", ({ eq }) => {
  eq(1 + 1, 2);
});

process.env.TEST_DIR = "fake";
test("invalid dir", ({ eq }) => {
  eq(1 + 1, 2);
});
