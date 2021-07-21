const fs = require("fs");

const charCount = fs.readFileSync("./index.js", "utf-8").length;
if (charCount > 5000) {
  throw new Error("[flug] index.js is too long at " + charCount + " characters");
} else {
  console.log("passed linting");
}
