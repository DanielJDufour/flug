// const $ = cmd => require("child_process").execFileSync(cmd, { cwd: __dirname }).toString();

// $("")
const fs = require("fs");

const lineCount = fs.readFileSync("./index.js", "utf-8").split(/\n\r?/g).length;
if (lineCount > 100) {
  throw new Error("[flug] index.js is too long at " + lineCount + " lines");
}
