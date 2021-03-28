const test = require("../index.js");

test("error", ({ eq }) => {
  throw "error";
});
