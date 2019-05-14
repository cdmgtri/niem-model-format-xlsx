
let fs = require("fs");

let ChangeRequestQA = require("../src/index");

describe("Load", () => {

  test("QA on valid CR", () => {
    data = fs.readFileSync("test/usmtf-enums-distroA.xlsx");
    let results = ChangeRequestQA(data, "usmtf-enums-distroA-cr-qa");
    expect(results.issues.length).toEqual(0);
  });

});
