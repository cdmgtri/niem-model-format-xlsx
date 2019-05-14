
let XLSX = require("xlsx");

let Issue = require("./issue/index");
let Tests = require("./tests/index");
let { cr, TabInfo } = require("./cr-info/index");

/** @type {Issue[]} */
let issues = [];

let results = {tests: Tests, issues};

let BLANK = "___";
let ROW_NUM = "__rowNum__";

let CHANGE_CODES = ["add", "edit", "delete", "comment", "map", "subset"];
let CONTENT_STYLES = ["CCC", "CSC", "S"];
let SIMPLE_BASES = ["xs:string", "xs:token"];
let FACET_KINDS = ["enumeration", "length", "minLength", "maxLength", "pattern",
"whiteSpace", "maxInclusive", "minInclusive", "maxExclusive", "minExclusive",
"totalDigits", "fractionDigits"];

/**
 * Runs QA on a CR spreadsheet.
 *
 * @param {Buffer} data - CR spreadsheet loaded into buffer
 */
function ChangeRequestQA(data, label="niem-cr-qa") {

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

/**
 * Loads tab data from the CR spreadsheet.
 *
 * Tests:
 * - Check for required tabs
 * - Check for required tab columns
 *
 * @param {Buffer} data
 */
function loadWorksheets(data) {

  let workbook = XLSX.read(data);

  // For each expected tab...
  for (let tabName in cr) {

    /** @type {TabInfo} */
    let tab = cr[tabName];

    // Load the tab from the workbook
    let sheet = workbook.Sheets[tabName];
    tab.rows = XLSX.utils.sheet_to_json(sheet, {defval: BLANK});

    // Log an issue if the tab is required but does not exist in the workbook
    if (tab.required && !sheet) {
      issues.push(new Issue(tabName, null, null, null, Tests.MissingTab, `Tab '${tabName}' is missing from the spreadsheet.`));
    }

    // Check tab for required columns
    if (tab.rows.length > 0) {
      let row = tab.rows[1];
      for (let key in tab.cols) {
        let colName = tab.cols[key];
        if (!row[colName]) {
          issues.push(new Issue(tabName, null, null, null, Tests.MissingColumn, `Column '${colName}' is required in the the '${tabName}' tab.`));
        }
      }
    }
  }

}

/**
 * Load arrays of component qualified names for use in reference checks.
 */
function loadComponents() {

  // Qualified simple type names
  cr.Type.simpleTypeQNames = loadFilteredTypes("S");

  // Qualified CSC type names
  cr.Type.cscTypeQNames = loadFilteredTypes("CSC");

  // Qualified CCC type names
  cr.Type.cccTypeQNames = [...loadFilteredTypes("CCC"), ...loadFilteredTypes(BLANK)];

  // All qualified type names
  cr.Type.typeQNames = [
    ...cr.Type.simpleTypeQNames,
    ...cr.Type.cscTypeQNames,
    ...cr.Type.cccTypeQNames
  ];

  // Create a distinct list of qualified types on the Facet tab
  cr.Facet.typeQNames = new Set(
    cr.Facet.rows
      .filter( row => row[cr.Facet.cols.Code] == "add" )
      .map( row => row[cr.Facet.cols.NewTypeQName])
  );

  // Create a distinct list of qualified types on the Facet tab
  cr.Facet.enumTypeQNames = new Set(
    cr.Facet.rows
      .filter( row => {
        let kind = getFacetKind( row[cr.Facet.cols.NewKind] );
        return row[cr.Facet.cols.Code] == "add" && kind == "enumeration";
      })
      .map( row => row[cr.Facet.cols.NewTypeQName])
  );

}

/**
 * Returns qualified type names with the given content style
 */
function loadFilteredTypes(contentStyle) {
  return cr.Type.rows
    .filter( row => {
      return row[cr.Type.cols.Code] == "add" && row[cr.Type.cols.ContentStyle] == contentStyle;
    })
    .map( row => row[cr.Type.cols.NewNS] + ":" + row[cr.Type.cols.NewName]);
}

/**
 * Test values in the Type tab.
 */
function checkTypes() {

  let tab = cr.Type;

  for (let rowIndex in tab.rows) {

    let row = tab.rows[rowIndex];
    let code = row[tab.cols.Code];
    let rowNum = row[ROW_NUM];
    let oldQName = String(row[tab.cols.OldQName]);
    let ns = String(row[tab.cols.NewNS]);
    let name = String(row[tab.cols.NewName]);
    let qname = ns + ":" + name;
    let label = qname || oldQName;
    let def = String(row[tab.cols.NewDefinition]);
    let contentStyle = getContentStyle(row[tab.cols.ContentStyle]);
    let base = String(row[tab.cols.NewBase]);

    // Create an object to track type counts, e.g., {qname: count}
    let typeCounts = cr.Type.typeQNames.reduce( (accumulator, cur) => {
      accumulator[cur] = accumulator[cur] + 1 || 1;
      return accumulator;
    }, {});

    // Create an object with only the duplicate types and counts
    let duplicateTypes = {};

    for (let qname in typeCounts) {
      if (typeCounts[qname] > 1) {
        duplicateTypes[qname] = typeCounts[qname];
      }
    }

    if (! validCode(code)) {
      // Invalid change code
      issues.push(new Issue(tab.name, rowNum, tab.cols.Code, label, Tests.InvalidChangeCode, "Valid change code values are 'add', 'edit', 'delete', or 'comment'."));
    }

    if (code === "add") {

      // NAMESPACE CHECKS -----

      if (ns == BLANK) {
        // Missing namespace
        issues.push(new Issue(tab.name, rowNum, tab.cols.NewNS, label, Tests.RequiredField, "A namespace is required for 'add' operations."));
      }

      // NAME CHECKS -----

      if (name == BLANK) {
        // Missing type name
        issues.push(new Issue(tab.name, rowNum, tab.cols.NewName, label, Tests.RequiredField, "A name is required for 'add' operations."));
      }

      if (contentStyle == "S" && !name.endsWith("SimpleType")) {
        // Simple type names must end with "SimpleType"
        issues.push(new Issue(tab.name, rowNum, tab.cols.NewName, label, Tests.InvalidField, "The name of a simple type must end with 'SimpleType'."));
      }

      if (contentStyle != "S" && name.endsWith("SimpleType")) {
        // Complex type names cannot end with "SimpleType"
        issues.push(new Issue(tab.name, rowNum, tab.cols.NewName, label, Tests.InvalidField, "The name of a complex type cannot end with 'SimpleType'."));
      }

      if (name.endsWith("CodeSimpleType") && !cr.Facet.enumTypeQNames.has(qname)) {
        // Type name ends with CodeSimpleType but does not appear in Facet tab with enums
        issues.push(new Issue(tab.name, rowNum, tab.cols.NewName, label, Tests.InvalidField, "A type with a name that ends with 'CodeSimpleType' must declare enumerations in the 'Facet' tab."));
      }

      if (name.endsWith("CodeType") && !base.endsWith("CodeSimpleType")) {
        // Type name ends with CodeType but does not have a base of CodeSimpleType
        issues.push(new Issue(tab.name, rowNum, tab.cols.NewName, label, Tests.InvalidField, "A type with a name that ends with 'CodeType' must have a base type with a name that ends with 'CodeSimpleType'"));
      }

      if (qname in duplicateTypes) {
        // Type name is duplicated in this tab
        issues.push(new Issue(tab.name, rowNum, tab.cols.NewName, label, Tests.InvalidField, "The type name is duplicated in the spreadsheet."));
      }

      if (name.match(/Type.*Type/)) {
        // Type name contains the term "Type" outside of its representation term
        issues.push(new Issue(tab.name, rowNum, tab.cols.NewName, label, Tests.Warning, "NIEM recommends only using the term 'Type' as the final representation term in a type name. The term 'Category' is typically used instead."));
      }

      // DEFINITION CHECKS -----

      if (def == BLANK) {
        // Missing definition
        issues.push(new Issue(tab.name, rowNum, tab.cols.NewDefinition, label, Tests.RequiredField, "A definition is required for 'add' operations."));
      }
      else if (! def.startsWith("A data type ")) {
        // Definition does not use the correct standard opening phrase
        issues.push(new Issue(tab.name, rowNum, tab.cols.NewDefinition, label, Tests.InvalidField, "A type definition must begin with 'A data type '."));
      }

      // INVALID FIELD CHECKS -----

      if (row[tab.cols.OldQName] != BLANK) {
        // Old type name should not be provided for an "add" row
        issues.push(new Issue(tab.name, rowNum, tab.cols.OldQName, label, Tests.InvalidField, "An old qualified name is not allowed for 'add' operations."));
      }

      // CONTENT STYLE CHECKS -----

      if (! CONTENT_STYLES.includes(contentStyle)) {
        // Invalid content style
        issues.push(new Issue(tab.name, rowNum, tab.cols.ContentStyle, label, Tests.InvalidField, `Valid content styles are ${CONTENT_STYLES.join(",")}.  A blank field is also valid, and will default to 'CCC'.`));
      }

      // BASE TYPE CHECKS -----

      if (base == BLANK && (contentStyle == "CSC" || contentStyle == "S")) {
        // Missing base type
        issues.push(new Issue(tab.name, rowNum, tab.cols.NewBase, label, Tests.RequiredField, "A base type is required for ${contentStyle} types."));
      }

      if (contentStyle == "S" && !SIMPLE_BASES.includes(base)) {
        // Base of simple type does not come from approved XML type list
        issues.push(new Issue(tab.name, rowNum, tab.cols.NewBase, label, Tests.InvalidField, "A simple type must have a valid XML base type, like 'xs:token' or 'xs:string'"));
      }

      if (contentStyle == "CSC" && !cr.Type.simpleTypeQNames.includes(base)) {
        // Base of CSC type does not appear as one of the simple types in this spreadsheet
        issues.push(new Issue(tab.name, rowNum, tab.cols.NewBase, label, Tests.InvalidField, "A CSC type must have a simple ('S') base type defined in this spreadsheet.  Make sure the base type is qualified."));
      }

    }
  }

}

function checkFacets() {

  let tab = cr.Facet;

  for (let rowIndex in tab.rows) {

    let row = tab.rows[rowIndex];
    let code = String(row[tab.cols.Code]);
    let rowNum = String(row[ROW_NUM]);
    let oldQName = String(row[tab.cols.OldTypeQName]);
    let qname = String(row[tab.cols.NewTypeQName]);
    let value = String(row[tab.cols.NewValue]);
    let def = String(row[tab.cols.NewDefinition]);
    let kind = getFacetKind(row[tab.cols.NewKind]);
    let label = (qname || oldQName) + " - " + kind + ": " + value;

    if (! validCode(code)) {
      // Invalid change code
      issues.push(new Issue(tab.name, rowNum, tab.cols.Code, label, Tests.InvalidChangeCode, "Valid change code values are 'add', 'edit', 'delete', or 'comment'."));
    }


    if (code === "add") {

      // QNAME CHECKS -----

      if (qname == BLANK || !qname.includes(":")) {
        // Missing type name or type name is not qualified
        issues.push(new Issue(tab.name, rowNum, tab.cols.NewTypeQName, label, Tests.RequiredField, "A qualified type name is required for 'add' operations."));
      }

      if (! cr.Type.simpleTypeQNames.includes(qname)) {
        // Type is not defined in the Type tab
        issues.push(new Issue(tab.name, rowNum, tab.cols.NewTypeQName, label, Tests.InvalidField, "The type must be defined in the 'Type' tab as a simple type."))
      }


      // VALUE CHECKS -----

      if (value == BLANK) {
        // Missing facet value
        issues.push(new Issue(tab.name, rowNum, tab.cols.NewValue, label, Tests.RequiredField, "A facet value is required for 'add' operations."))
      }


      // DEFINITION CHECKS -----

      if (def == BLANK && kind == "enumeration") {
        // Missing definition
        issues.push(new Issue(tab.name, rowNum, tab.cols.NewDefinition, label, Tests.RequiredField, "A definition for an enumeration is required for all 'add' operations."));
      }

      // KIND CHECKS -----

      if (! FACET_KINDS.includes(kind)) {
        // Invalid facet kind
        issues.push(new Issue(tab.name, rowNum, tab.cols.NewKind, label, Tests.InvalidField, "Only the following facet kinds are allowed: " + FACET_KINDS.join(", ") + "."));
      }


    }
  }

}

/**
 * Check that the given code uses an allowable value.
 *
 * @param {String} codeValue
 */
function validCode(codeValue) {
  return CHANGE_CODES.includes(codeValue);
}

/**
 * Return the given content style, or "CCC" (default value) if blank.
 *
 * @param {String} value
 * @returns {String}
 */
function getContentStyle(value) {
  return ( value == BLANK ? "CCC" : value);
}

/**
 * Returns the given facet kind, or "enumeration" (default value) if blank,
 */
function getFacetKind(value) {
  return ( value == BLANK ? "enumeration" : value);
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

module.exports = ChangeRequestQA;
