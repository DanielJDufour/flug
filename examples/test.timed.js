const test = require("../index.js");

process.env.TEST_TIMED = "true";

test("timed", ({ eq }) => {});
