const test = require("../index.js");

test("failure", ({ eq }) => {
  eq(8 * 8, 0);
});
