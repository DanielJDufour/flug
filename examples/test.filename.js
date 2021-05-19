const test = require("../index.js");

process.env.TEST_FILE = "test.filename.js";
test("valid filename", ({ eq }) => {
  eq(1 + 1, 2);
});

process.env.TEST_FILE = "test.fake.js";
test("invalid filename", ({ eq }) => {
  eq(1 + 1, 2);
});
