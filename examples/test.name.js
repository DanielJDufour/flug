const test = require("../index.js");

process.env.TEST_NAME = "only";
let count = 0;
test("skip", ({ eq }) => {
  count++;
  throw new Error("shouldn't be running this test");
});

test("only", ({ eq }) => {
  count++;
  eq(count, 1);
});
