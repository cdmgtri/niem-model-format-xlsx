
let XLSX = require("xlsx");

let NIEM = require("niem");
let QA = require("niem-qa");

let runSpreadsheetQA = require("./qa/index");

// XLSX values
let BLANK = "";
let ROW_NUM = "__rowNum__";

let { Release, Type, Facet, Namespace } = NIEM.ModelObjects;
let { checkRelease, Test, Issue } = QA;
let { Tabs, TabType } = require("./spreadsheet/index");

/** @type {Test[]} */
let testSuite = require("../tests.json");



class NIEMMapping {

  /**
   * @param {Buffer} buffer - NIEM mapping spreadsheet loaded into buffer
   */
  constructor(buffer) {

    this.niem = new NIEM();

    /** @type {Tabs} */
    this.tabs = JSON.parse(JSON.stringify(Tabs));

    /** @type {Test[]} */
    this.tests = JSON.parse(JSON.stringify(testSuite));

    this.validFormat = false;
    this.loaded = false;

    /** @type {Release} */
    this.data;

    this.loadSpreadsheet(buffer);

  }


  /**
   * Loads data from the NIEM mapping spreadsheet
   *
   * @param {Buffer} spreadsheetBuffer - NIEM mapping spreadsheet read into buffer
   */
  loadSpreadsheet(spreadsheetBuffer) {

    let workbook = XLSX.read(spreadsheetBuffer, {type: "array"});

    let tabTest = Test.run(this.tests, "spread-format-tabs");
    let colTest = Test.run(this.tests, "spread-format-columns");

    // For each expected tab...
    for (let [tabName, tab] of Object.entries(this.tabs)) {

      // Load the tab from the workbook
      let sheet = workbook.Sheets[tab.name];
      tab.rows = XLSX.utils.sheet_to_json(sheet, {defval: BLANK});

      // Log an issue if the tab is required but does not exist in the workbook
      if (tab.required && !sheet) {
        let issue = new Issue("Spreadsheet", tab.name, "", "", "", tab.name, "Missing tab");
        tabTest.issues.push(issue);
      }

      // Check tab for required columns
      if (tab.rows.length > 0) {
        let row = tab.rows[0];
        for (let key in tab.cols) {
          let colName = tab.cols[key];
          if (! row.hasOwnProperty(colName)) {
            let issue = new Issue("Spreadsheet", tab.name, "", colName, "", "", "Missing column");
            colTest.issues.push(issue);
          }
        }
      }
    }

    if (this.issueCount == 0) {
      this.validFormat = true;
      runSpreadsheetQA(this.tests, this.tabs);
    }

  }

  get failedTests() {
    return this.tests.filter( test => test.issues.length > 0 );
  }

  get failedTestCount() {
    return this.failedTests.length;
  }

  get issues() {
    /** @type {Issue[]} */
    let issues = [];
    this.failedTests.forEach( test => issues.push(...test.issues) );
    return issues;
  }

  get issueCount() {
    return this.issues.length;
  }


  /**
   * @todo Add other tab data
   * @todo Load base NIEM release
   *
   * @param {String} userName
   * @param {String} modelName
   * @param {String} releaseName
   */
  async loadData(userName="user", modelName="model", releaseName="release") {

    this.data = await this.niem.releases.sandbox(userName, modelName, releaseName);

    let typeCols = this.tabs.Type.cols;

    for (let row of this.tabs.Type.rows) {
      if (row[typeCols.Code] == "add") {
        let type = new Type(null,
          row[typeCols.TargetPrefix],
          row[typeCols.TargetName],
          row[typeCols.TargetDefinition],
          row[typeCols.TargetStyle] || "object",
          row[typeCols.TargetBase]
        );
        type.source = getSource(this.tabs.Type, row);
        await this.data.types.add(type);
      }
    }


    let facetCols = this.tabs.Facet.cols;

    for (let row of this.tabs.Facet.rows) {
      if (row[facetCols.Code] == "add") {
        let facet = new Facet(null,
          row[facetCols.TargetPrefix] + ":" + row[facetCols.TargetName],
          row[facetCols.TargetValue],
          row[facetCols.TargetDefinition],
          row[facetCols.TargetKind] || "enumeration"
        );
        facet.source = getSource(this.tabs.Facet, row);
        await this.data.facets.add(facet);
      }
    }


    let nsCols = this.tabs.Namespace.cols;

    for (let row of this.tabs.Namespace.rows) {
      if (row[nsCols.Code] == "add") {
        let ns = new Namespace(null,
          row[nsCols.TargetPrefix],
          row[nsCols.TargetURI],
          row[nsCols.TargetFileName],
          row[nsCols.TargetDefinition],
          row[nsCols.TargetDraftVersion],
          row[nsCols.TargetStyle]
        );
        ns.source = getSource(this.tabs.Namespace, row);
        await this.data.namespaces.add(ns);
      }
    }

    await checkRelease(this.tests, this.data);

  }

  runQA() {
    //
  }

  generateWantlist() {
    // TODO
  }

  generateModel() {
    // TODO
  }

  generateXSDs() {
    // TODO
  }

}

/**
 * Runs QA on a CR spreadsheet.
 *
 * @param {Buffer} data - CR spreadsheet loaded into buffer
 */
function ChangeRequestQA(data, label="niem-mapping-qa") {

  loadWorksheets(data);

  if (issues.length > 0) {
    // Do not continue: missing required tabs or columns
    return results;
  }

  loadComponents();
  checkTypes();
  checkFacets();
  saveIssues(label);

  return results;
}


function saveIssues(fileName) {
  let workbook = XLSX.utils.book_new();
  let header = ["Tab", "Row", "Col", "Label", "Category", "Description"];
  let sheet = XLSX.utils.json_to_sheet(issues, {header});

  // TODO: Figure out how to enable worksheet filter
  // sheet["!protect"].autoFilter = true;

  XLSX.utils.book_append_sheet(workbook, sheet, "Issues");
  XLSX.writeFile(workbook, fileName + "-QA.xlsx");
}

/**
 * Gets the row number and adjusts for the zero-based index.
 * @param {Object} row
 * @returns Number
 */
function getRow(row) {
  return row[ROW_NUM] + 1;
}

/**
 * @param {TabType} tab
 * @param {Object} row
 */
function getSource(tab, row) {
  return {
    location: tab.name,
    line: getRow(row),
    position: ""
  };
}

module.exports = NIEMMapping;
