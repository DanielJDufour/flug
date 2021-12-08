const test = require("../index.js");

(async () => {
  process.env.TEST_NAME = "only*";
  let count = 0;
  await test("skip", ({ eq }) => {
    count++;
    throw new Error("shouldn't be running this test");
  });

  await test("only this", ({ eq }) => {
    count++;
    eq(count, 1);
  });
})();
