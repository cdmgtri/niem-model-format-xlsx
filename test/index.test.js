
let fs = require("fs");
let path = require("path");
let { Test } = require("niem-qa");

let NIEMMapping = require("../src/index");


describe("Valid example", () => {

  test("loadSpreadsheet", () => {
    let data = loadData("iepd-requirements", "iepd-requirements-example");
    let mapping = new NIEMMapping(data);

    expect(mapping.issues.length).toBe(0);
    expect(mapping.validFormat).toBeTruthy();
  });

});

/**
 * @todo Link in the test spreadsheet for more issue information
 */
describe("Invalid format", () => {

  /** @type {NIEMMapping} */
  let mapping;

  beforeAll( () => {
    let data = loadData("iepd-requirements", "iepd-requirements-example-invalid-formatting");
    mapping = new NIEMMapping(data);
    saveTests("format", mapping);
  });

  test("loadSpreadsheet", () => {
    expect(mapping.issues.length).toBe(7);
    expect(mapping.validFormat).toBeFalsy();
  });

  callTest(() => mapping, "spread-format-tabs", 1);
  callTest(() => mapping, "spread-format-columns", 6);

});

describe("Invalid modeling", () => {

  /** @type {NIEMMapping} */
  let mapping;

  beforeAll( async () => {
    let data = loadData("iepd-requirements", "iepd-requirements-example-invalid-modeling");
    mapping = new NIEMMapping(data);
    await mapping.loadData();
    saveTests("modeling", mapping);
  });

  test("loadSpreadsheet", () => {
    expect(mapping.validFormat).toBeTruthy();
    // expect(mapping.issues.length).toBe(12);
  });

  /**
   * Find tests with issues that have not been marked as "ran".
   */
  test("ranTests", () => {
    let unmarked = mapping.tests.filter( test => ! test.ran && test.issues.length > 0 )
    expect(unmarked.length).toBe(0);
  });

  // Spreadsheet checks
  callTest(() => mapping, "spread-format-tabs", 0);
  callTest(() => mapping, "spread-format-columns", 0);
  callTest(() => mapping, "spread-format-code-invalid", 2, "invalid");
  callTest(() => mapping, "spread-format-fields-required", 7, "")
  callTest(() => mapping, "spread-format-fields-name", 1, "ext:QualifiedNameType")
  callTest(() => mapping, "spread-format-fields-qname", 1, "NonQualifiedBaseType")

  // Type checks
  callTest(() => mapping, "type-name-all-missing", 1);
  callTest(() => mapping, "type-name-all-invalidChars", 4, "#InvalidStartCharType");
  callTest(() => mapping, "type-name-all-repTerm", 2, "MissingRepTerm");
  callTest(() => mapping, "type-name-all-duplicate", 2, "DuplicateType");
  callTest(() => mapping, "type-name-all-camelCase", 3, "invalidCamelCaseType");
  callTest(() => mapping, "type-name-simple-repTerm", 2, "InvalidSimpleStyleNameType");
  callTest(() => mapping, "type-name-complex-repTerm", 1, "InvalidSimpleType");
  callTest(() => mapping, "type-name-codeType-invalid", 1, "InvalidBaseCodeType");
  callTest(() => mapping, "type-name-codeSimpleType-invalid", 1, "NoCodesCodeSimpleType");
  callTest(() => mapping, "type-name-term-type", 1, "InvalidTermTypeNameType");
  callTest(() => mapping, "type-prefix-all-missing", 1);
  callTest(() => mapping, "type-prefix-all-invalid", 1, "unknown");
  callTest(() => mapping, "type-def-all-phrase", 1, "InvalidDefinitionType");
  callTest(() => mapping, "type-def-all-missing", 1, "MissingDefinitionType");
  callTest(() => mapping, "type-base-all-invalid", 4, "ext:DoesNotExistCodeSimpleType");
  callTest(() => mapping, "type-base-simpleContent-missing", 3, "ext:DoesNotExistCodeSimpleType");
  callTest(() => mapping, "type-base-csc-invalid", 1, "ext:ObjectType");
  callTest(() => mapping, "type-base-simple-invalid", 2, "ext:NoCodesCodeSimpleType");
  callTest(() => mapping, "type-style-all-missing", 0);
  callTest(() => mapping, "type-style-all-invalid", 1, "wrongStyle");

  // Facet checks
  callTest(() => mapping, "facet-prefix-all-missing", 2);
  callTest(() => mapping, "facet-prefix-all-invalid", 1, "unknown");
  callTest(() => mapping, "facet-name-all-missing", 1);
  callTest(() => mapping, "facet-name-all-invalid", 2, "ext:UnknownCodeSimpleType");
  callTest(() => mapping, "facet-name-all-complex", 3, "ext:MovieType");
  callTest(() => mapping, "facet-name-code-invalid", 4, "ext:InvalidEnumSimpleType");
  callTest(() => mapping, "facet-value-all-missing", 1);
  callTest(() => mapping, "facet-value-code-duplicate", 2, "ext:AccessModeSufficientCodeSimpleType - enumeration=l");
  callTest(() => mapping, "facet-def-code-missing", 3);
  callTest(() => mapping, "facet-def-pattern-missing", 1);
  callTest(() => mapping, "facet-kind-all-invalid", 1, "wrongKind");

});


function loadData(exampleFolder, fileName) {
  let filePath = path.resolve("examples", exampleFolder, fileName + ".xlsx");
  return fs.readFileSync(filePath);
}

/**
 * @param {Test[]} tests
 * @param {String} testID
 * @parm {Number} expectedCount
 * @parm {String} expectedProblemValue
 */
function checkIssues(tests, testID, expectedCount, expectedProblemValue) {
  let test = Test.find(tests, testID);
  expect(test.issues.length).toBe(expectedCount);

  if (expectedProblemValue) {
    let issue = test.issues.find( issue => issue.problemValue == expectedProblemValue );
    expect(issue).not.toBeNull();
  }

}

/**
 * @param {Function} getMapping
 * @param {String} testID
 * @parm {Number} expectedCount
 * @parm {String} expectedProblemValue
 */
function callTest(getMapping, testID, expectedCount, expectedProblemValue) {
  test(testID, () => {
    let mapping = getMapping();
    checkIssues(mapping.tests, testID, expectedCount, expectedProblemValue);
  });
}

/**
 * Save the ran tests to a JSON file.
 *
 * @param {String} fileStem
 * @param {NIEMMapping} mapping
 * @param {Boolean} [issuesOnly=true]
 */
function saveTests(fileStem, mapping, issuesOnly=true) {
  let testList = issuesOnly ? mapping.failedTests : mapping.tests;
  let json = JSON.stringify(testList, null, 2);
  fs.writeFileSync(`test/example-${fileStem}-issues.json`, json);
}