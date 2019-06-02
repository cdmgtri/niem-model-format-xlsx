
// Converts the test suite spreadsheet to JSON

let fs = require("fs");
let { Test } = require("niem-qa");

let tests = Test.loadTestSuite("tests.xlsx");
let json = JSON.stringify(tests, null, 2);
fs.writeFileSync("tests.json", json);

console.log("Updated tests.json");
