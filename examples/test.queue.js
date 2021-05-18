const test = require("../index.js");

const a = 1;
const b = 2;
const c = 3;

test("first", async ({ eq }) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  eq(a + b, c);
});

test("second", async ({ eq }) => {
  await new Promise(resolve => setTimeout(resolve, 5));
  eq(a + b, c);
});

test("third", ({ eq }) => {
  eq(a + b, c);
});
