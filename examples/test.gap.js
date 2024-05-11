const test = require("../index.js");

// sleep 3 seconds between tests
process.env.TEST_GAP_TIME = "3";

test("first", ({ eq }) => {});

test("second", ({ eq }) => {});
