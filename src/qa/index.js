
let { tabs, TabType, CODES, CodeType, CONTENT_STYLES, FACET_KINDS  } = require("../spreadsheet/index");

let { Test, Issue } = require("niem-qa");

// let BLANK = "(blank)";
let ROW_NUM = "__rowNum__";


/**
 * Runs general mapping spreadsheet tests.
 *
 * @param {Test[]} tests
 * @param {tabs} tabs
 */
function qa(tests, tabs) {

  // General spreadsheet checks
  checkValidMappingCodes(tests, tabs);
  checkSpreadsheetRequiredFields(tests, tabs);
  checkNameFields(tests, tabs);
  checkQNameFields(tests, tabs);

  // Tab-specific checks
  checkTypes(tests, tabs);
  checkFacets(tests, tabs);

}

/**
 * Checks each row in each of the tabs for invalid mapping codes.
 *
 * @param {Test[]} tests
 * @param {tabs} tabs
 */
function checkValidMappingCodes(tests, tabs) {

  let test = Test.run(tests, "spread-format-code-invalid");

  for (let [tabName, tab] of Object.entries(tabs)) {

    if (tabName == tabs.Info.name) {
      continue;
    }

    tab.rows.forEach( row => {
      let code = row[tab.cols.Code];

      if (! CODES.includes(code)) {
        let issue = new Issue("", tab.name, row[ROW_NUM] + 1, tab.cols.Code, code, "", tab.name, row, tab.cols.Code);
        test.issues.push(issue);
      }
    });

  }

  return test.issues;

}

/**
 * @param {Test[]} tests
 * @param {tabs} tabs
 */
function checkSpreadsheetRequiredFields(tests, tabs) {

  let test = Test.run(tests, "spread-format-fields-required");

  // Property tab checks

  checkTabRequiredFields(test, tabs.Property, ["add"],
    tabs.Property.cols.TargetName, [
      tabs.Property.cols.TargetPrefix,
      tabs.Property.cols.TargetName,
      tabs.Property.cols.TargetDefinition
  ]);

  checkTabRequiredFields(test, tabs.Property, ["edit", "delete"],
    tabs.Property.cols.SourceName, [
      tabs.Property.cols.SourcePrefix,
      tabs.Property.cols.SourceName
  ]);

  checkTabRequiredFields(test, tabs.Property, ["map", "subset"],
    tabs.Property.cols.TargetName, [
      tabs.Property.cols.TargetPrefix,
      tabs.Property.cols.TargetName
  ]);


  // Type tab checks

  checkTabRequiredFields(test, tabs.Type, ["add"],
    tabs.Type.cols.TargetName, [
      tabs.Type.cols.TargetPrefix,
      tabs.Type.cols.TargetName,
      tabs.Type.cols.TargetDefinition
  ]);

  checkTabRequiredFields(test, tabs.Type, ["edit", "delete", "clear"],
    tabs.Type.cols.SourceName, [
      tabs.Type.cols.SourcePrefix,
      tabs.Type.cols.SourceName
  ]);

  checkTabRequiredFields(test, tabs.Type, ["map", "subset"],
    tabs.Type.cols.TargetName, [
      tabs.Type.cols.TargetPrefix,
      tabs.Type.cols.TargetName
  ]);


  // TypeContainsProperty tab checks

  checkTabRequiredFields(test, tabs.TypeContainsProperty, ["add", "map", "subset"],
    tabs.TypeContainsProperty.cols.TargetPropertyName, [
      tabs.TypeContainsProperty.cols.TargetTypePrefix,
      tabs.TypeContainsProperty.cols.TargetTypeName,
      tabs.TypeContainsProperty.cols.TargetPropertyPrefix,
      tabs.TypeContainsProperty.cols.TargetPropertyName
  ]);

  checkTabRequiredFields(test, tabs.TypeContainsProperty, ["edit", "delete"],
    tabs.TypeContainsProperty.cols.SourcePropertyName, [
      tabs.TypeContainsProperty.cols.SourceTypePrefix,
      tabs.TypeContainsProperty.cols.SourceTypeName,
      tabs.TypeContainsProperty.cols.SourcePropertyPrefix,
      tabs.TypeContainsProperty.cols.SourcePropertyPrefix
  ]);


  // Facet tab checks

  checkTabRequiredFields(test, tabs.Facet, ["add"],
    tabs.Facet.cols.TargetValue, [
      tabs.Facet.cols.TargetPrefix,
      tabs.Facet.cols.TargetName,
      tabs.Facet.cols.TargetValue
  ]);

  checkTabRequiredFields(test, tabs.Facet, ["edit", "delete"],
    tabs.Facet.cols.SourceValue, [
      tabs.Facet.cols.SourcePrefix,
      tabs.Facet.cols.SourceName,
      tabs.Facet.cols.SourceValue
  ]);

  checkTabRequiredFields(test, tabs.Facet, ["map", "subset"],
    tabs.Facet.cols.TargetValue, [
      tabs.Facet.cols.TargetPrefix,
      tabs.Facet.cols.TargetName,
      tabs.Facet.cols.TargetValue
  ]);


  // Namespace tab checks

  checkTabRequiredFields(test, tabs.Namespace, ["add"],
    tabs.Namespace.cols.TargetPrefix, [
      tabs.Namespace.cols.TargetPrefix,
      tabs.Namespace.cols.TargetURI,
      tabs.Namespace.cols.TargetFileName,
      tabs.Namespace.cols.TargetDefinition
  ]);

  checkTabRequiredFields(test, tabs.Namespace, ["edit", "delete", "clear"],
    tabs.Namespace.cols.SourcePrefix, [
      tabs.Namespace.cols.SourcePrefix
  ]);

  checkTabRequiredFields(test, tabs.Namespace, ["map", "subset"],
    tabs.Namespace.cols.TargetPrefix, [
      tabs.Namespace.cols.TargetPrefix,
      tabs.Namespace.cols.TargetURI
  ]);


  // LocalTerm tab checks

  checkTabRequiredFields(test, tabs.LocalTerminology, ["add", "map", "subset"],
    tabs.LocalTerminology.cols.TargetTerm, [
      tabs.LocalTerminology.cols.TargetPrefix,
      tabs.LocalTerminology.cols.TargetTerm
  ]);

  // Check for required literal OR definition column for an add row
  let tabTerm = tabs.LocalTerminology;
  let colLiteral = tabTerm.cols.TargetLiteral;
  let colDef = tabTerm.cols.TargetDefinition;

  tabTerm.rows
    .filter( row => row[tabTerm.cols.Code] == "add" )
    .filter( row => row[colLiteral] == "" && row[colDef] == "" )
    .forEach( row => {
      let issue = new Issue("", tabTerm.name, row[ROW_NUM] + 1, "", "", "", "A target literal or definition value is required.");
      test.issues.push(issue)
    });


  checkTabRequiredFields(test, tabs.LocalTerminology, ["edit", "delete"],
    tabs.LocalTerminology.cols.SourceTerm, [
      tabs.LocalTerminology.cols.SourcePrefix,
      tabs.LocalTerminology.cols.SourceTerm
  ]);


  // Metadata tab checks

  checkTabRequiredFields(test, tabs.Metadata, ["add", "map", "subset"],
    tabs.Metadata.cols.TargetMetadataName, [
      tabs.Metadata.cols.TargetMetadataPrefix,
      tabs.Metadata.cols.TargetMetadataName,
      tabs.Metadata.cols.TargetAppliesToPrefix,
      tabs.Metadata.cols.TargetAppliesToName
  ]);

  checkTabRequiredFields(test, tabs.Metadata, ["edit", "delete"],
    tabs.Metadata.cols.SourceMetadataName, [
      tabs.Metadata.cols.SourceMetadataPrefix,
      tabs.Metadata.cols.SourceMetadataName,
      tabs.Metadata.cols.SourceAppliesToPrefix,
      tabs.Metadata.cols.SourceAppliesToName
  ]);

  return test.issues;

}

/**
 * Check that rows with the given mapping code have non-blank values for each
 * of the given required columns.
 *
 * @param {Test} test
 * @param {TabType} tab
 * @param {CodeType[]} codes
 * @param {String} labelCol
 * @param {String[]} requiredCols
 */
function checkTabRequiredFields(test, tab, codes, labelCol, requiredCols) {

  requiredCols.forEach( col => {
    tab.rows
      .filter( row => codes.includes(row[tab.cols.Code]) )
      .filter( row => row[col] == "" )
      .forEach( row => {
        let issue = new Issue(row[labelCol], tab.name, row[ROW_NUM] + 1, col, "(missing)");
        test.issues.push(issue);
      });
  });

}

/**
 * @param {Test[]} tests
 * @param {tabs} tabs
 */
function checkNameFields(tests, tabs) {

  let test = Test.run(tests, "spread-format-fields-name");

  // Check name fields in tab Property
  let tab = tabs.Property;
  checkQualifiedField(test, tab, tab.cols.SourceName, false);
  checkQualifiedField(test, tab, tab.cols.TargetName, false);

  // Check name fields in tab Type
  tab = tabs.Type;
  checkQualifiedField(test, tab, tab.cols.SourceName, false);
  checkQualifiedField(test, tab, tab.cols.TargetName, false);

  // Check name fields in tab TypeContainsProperty
  tab = tabs.TypeContainsProperty;
  checkQualifiedField(test, tab, tab.cols.SourceTypeName, false);
  checkQualifiedField(test, tab, tab.cols.SourcePropertyName, false);
  checkQualifiedField(test, tab, tab.cols.TargetTypeName, false);
  checkQualifiedField(test, tab, tab.cols.TargetPropertyName, false);

  // Check name fields in tab Facet
  tab = tabs.Facet;
  checkQualifiedField(test, tab, tab.cols.SourceName, false);
  checkQualifiedField(test, tab, tab.cols.TargetName, false);

  // Check name fields in tab Union
  tab = tabs.Union;
  checkQualifiedField(test, tab, tab.cols.SourceUnionName, false);
  checkQualifiedField(test, tab, tab.cols.SourceMemberName, false);
  checkQualifiedField(test, tab, tab.cols.TargetUnionName, false);
  checkQualifiedField(test, tab, tab.cols.TargetMemberName, false);

  // Check name fields in tab Metadata
  tab = tabs.Metadata;
  checkQualifiedField(test, tab, tab.cols.SourceMetadataName, false);
  checkQualifiedField(test, tab, tab.cols.SourceAppliesToName, false);
  checkQualifiedField(test, tab, tab.cols.TargetMetadataName, false);
  checkQualifiedField(test, tab, tab.cols.TargetAppliesToName, false);

  return test.issues;

}


/**
 * @param {Test[]} tests
 * @param {tabs} tabs
 */
function checkQNameFields(tests, tabs) {

  let test = Test.run(tests, "spread-format-fields-qname");

  // Check qname fields in tab Property
  let tab = tabs.Property;
  checkQualifiedField(test, tab, tab.cols.TargetType, true);
  checkQualifiedField(test, tab, tab.cols.TargetGroup, true);

  // Check qname fields in tab Type
  tab = tabs.Type;
  checkQualifiedField(test, tab, tab.cols.TargetBase, true);

  return test.issues;

}

/**
 * @param {Test} test
 * @param {TabType} tab
 * @param {String} col
 * @param {Boolean} qualified
 */
function checkQualifiedField(test, tab, col, qualified) {

  tab.rows
    .filter( row => row[col] != "" && row[col] != "NONE")
    .filter( row => row[col].includes(":") != qualified )
    .forEach( row => {
      let issue = new Issue(row[col], tab.name, row[ROW_NUM] + 1, col, row[col]);
      test.issues.push(issue);
    });

}


/**
 * @param {Test[]} tests
 * @param {tabs} tabs
 */
function checkTypes(tests, tabs) {

  let test = Test.run(tests, "type-style-all-invalid");
  let tab = tabs.Type;
  let styleCol = tab.cols.TargetStyle;

  let problemTypes = tab.rows.filter( row => {
    let style = row[styleCol];
    return style != "" && ! CONTENT_STYLES.includes(style);
  });

  return problemTypes.map( row => {
    let issue = new Issue(row[tab.cols.TargetName], tab.name, row[ROW_NUM] + 1, styleCol, row[styleCol]);
    test.issues.push(issue);
    return issue;
  });

}

/**
 * Checks that Facet tab for invalid values in the Facet Kind column.
 *
 * @param {Test[]} tests
 * @param {tabs} tabs
 */
function checkFacets(tests, tabs) {

  let test = Test.run(tests, "facet-kind-all-invalid");
  let tab = tabs.Facet;
  let kindCol = tab.cols.TargetKind;

  let problemFacets = tabs.Facet.rows.filter( row => {
    let kind = row[kindCol];
    return kind != "" && ! FACET_KINDS.includes(kind);
  });

  return problemFacets.map( row => {
    let label = row[tab.cols.TargetName] & " - " & row[tab.cols.TargetValue];
    let issue = new Issue(label, tab.name, row[ROW_NUM] + 1, kindCol, row[kindCol]);
    test.issues.push(issue);
    return issue;
  });
}

module.exports = qa;
