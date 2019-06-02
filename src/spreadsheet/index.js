
let TabType = {

  /** @type {String} name */
  name: undefined,

  /** @type {Object[]} */
  rows: undefined,

  /** @type {Object<string, string>} */
  cols: undefined,

  /** @type {Boolean} implemented */
  required: undefined
};

let InfoCellNames = {
  SourceName: "Info_Source_Name",
  SourceVersion: "Info_Source_Version",
  SourceDate: "Info_Source_Date",
  SourceDescription: "Info_Source_Description",
  SourceWebsite: "Info_Source_Website",
  SourceURL: "Info_Source_URL",
  SourceContact: "Info_Source_Contact",

  MappingSummary: "Info_Mapping_Summary",
  MappingArtifact: "Info_Mapping_Artifact",
  MappingDescription: "Info_Mapping_Description",
  MappingStatus: "Info_Mapping_Status",
  MappingContact: "Info_Mapping_Contact",

  TargetName: "Info_Target_Name",
  TargetDescription: "Info_Target_Description",
  TargetRelease: "Info_Target_NIEMRelease",
  TargetWebsite: "Info_Target_Website",
  TargetURL: "Info_Target_URL",
  TargetContact: "Info_Target_Contact"
}

let PropertyColumns = {
  SourcePrefix: "Source\r\nNS Prefix",
  SourceName: "Property Name 1",
  SourceType: "Data Type",
  SourceDefinition: "Definition 1",

  Code: "Mapping\r\nCode",
  Description: "Description",
  Notes: "Notes",

  TargetPrefix: "Target\r\nNS Prefix",
  TargetName: "Property Name 2",
  TargetType: "Qualified Data Type",
  TargetDefinition: "Definition 2",
  TargetGroup: "Substitution Group 2",
  TargetIsAbstract: "Is Abstract?\r\ndefault=FALSE",
  TargetStyle: "Style\r\ndefault=element",
  TargetKeywords: "Keywords",
  TargetExampleContent: "Example Content",
  TargetUsageInfo: "Usage Info"
}

let TypeColumns = {
  SourcePrefix: "Source\r\nNS Prefix",
  SourceName: "Type Name 1",
  SourceBase: "Parent / Base Type 1",
  SourceDefinition: "Definition 1",

  Code: "Mapping\r\nCode",
  Description: "Description",
  Notes: "Notes",

  TargetPrefix: "Target\r\nNS Prefix",
  TargetName: "Type Name 2",
  TargetBase: "Parent / Base Type 2",
  TargetDefinition: "Definition 2",
  TargetStyle: "Style 2\r\ndefault=object",
};

let TypeContainsPropertyColumns = {
  SourceTypePrefix: "Source\r\nType NS",
  SourceTypeName: "Type Name 1",
  SourcePropertyPrefix: "Property NS 1",
  SourcePropertyName: "Property Name 1",
  SourceMin: "Min 1",
  SourceMax: "Max 1",

  Code: "Mapping\r\nCode",
  Description: "Description",
  Notes: "Notes",

  TargetTypePrefix: "Target\r\nType NS",
  TargetTypeName: "Type Name 2",
  TargetPropertyPrefix: "Property NS 2",
  TargetPropertyName: "Property Name 2",
  TargetMin: "Min\r\n(default=0)",
  TargetMax: "Max (default\r\n=unbounded)",
  TargetDefinition: "Definition\r\nFor an external property in an adapter type"
};

let FacetColumns = {
  SourcePrefix: "Source\r\nNS Prefix",
  SourceName: "Type Name 1",
  SourceValue: "Value 1",
  SourceDefinition: "Definition 1",
  SourceKind: "Kind of Facet 1\r\ndefault=enumeration",

  Code: "Mapping\r\nCode",
  Description: "Description",
  Notes: "Notes",

  TargetPrefix: "Target\r\nNS Prefix",
  TargetName: "Type Name 2",
  TargetValue: "Value 2",
  TargetDefinition: "Definition 2",
  TargetKind: "Kind of Facet 2\r\ndefault=enumeration",
};

let NamespaceColumns = {
  SourcePrefix: "Source\r\nNS Prefix",
  SourceURI: "URI 1",
  SourceDefinition: "Definition 1",

  Code: "Mapping\r\nCode",
  Description: "Description",
  Notes: "Notes",

  TargetPrefix: "Target\r\nNS Prefix",
  TargetStyle: "Style 2",
  TargetURI: "URI 2",
  TargetDefinition: "Definition 2",
  TargetNDRVersion: "NDR Version\r\ndefault=4.0",
  TargetNDRTarget: "NDR Target 2",
  TargetFileName: "File Name 2",
  TargetRelativePath: "Relative Path 2",
  TargetDraftVersion: "Draft Version 2"
};

let LocalTermColumns = {
  SourcePrefix: "Source\r\nNS Prefix",
  SourceTerm: "Term 1",
  SourceLiteral: "Literal 1",
  SourceDefinition: "Definition 1",

  Code: "Mapping\r\nCode",
  Description: "Description",
  Notes: "Notes",

  TargetPrefix: "Target\r\nNS Prefix",
  TargetTerm: "Term 2",
  TargetLiteral: "Literal 2",
  TargetDefinition: "Definition 2"
};

let TypeUnionColumns = {
  SourceUnionPrefix: "Source\r\nUnion NS",
  SourceUnionName: "Union Type Name 1",
  SourceMemberPrefix: "Member NS 1",
  SourceMemberName: "Member Type Name 1",

  Code: "Mapping\r\nCode",
  Description: "Description",
  Notes: "Notes",

  TargetUnionPrefix: "Target\r\nUnion NS",
  TargetUnionName: "Union Type Name 2",
  TargetMemberPrefix: "Member NS 2",
  TargetMemberName: "Member Type Name 2",
};

let MetadataColumns = {
  SourceMetadataPrefix: "Source\r\nMetadata NS",
  SourceMetadataName: "Metadata Type Name 1",
  SourceAppliesToPrefix: "Applies to NS 1",
  SourceAppliesToName: "Applies to Type Name 1",

  Code: "Mapping\r\nCode",
  Description: "Description",
  Notes: "Notes",

  TargetMetadataPrefix: "Target\r\nMetadata NS",
  TargetMetadataName: "Metadata Type Name 2",
  TargetAppliesToPrefix: "Applies to NS 2",
  TargetAppliesToName: "Applies to Type Name 2",
};

let tabs = {

  Info: {
    name: "Info",
    required: true,
    rows: {},
    cols: undefined,
    cells: InfoCellNames
  },

  Property: {
    name: "Property",
    required: true,
    cols: PropertyColumns,
    /** @type {Object[]} */
    rows: {}
  },

  Type: {
    name: "Type",
    required: true,
    cols: TypeColumns,
    /** @type {Object[]} */
    rows: undefined,
  },

  TypeContainsProperty: {
    name: "Type-Has-Property",
    required: true,
    cols: TypeContainsPropertyColumns,
    /** @type {Object[]} */
    rows: {},
  },

  Facet: {
    name: "Codes",
    required: true,
    cols: FacetColumns,
    /** @type {Object[]} */
    rows: undefined
  },

  Namespace: {
    name: "Namespace",
    required: true,
    cols: NamespaceColumns,
    /** @type {Object[]} */
    rows: {}
  },

  LocalTerminology: {
    name: "Local Terminology",
    required: true,
    cols: LocalTermColumns,
    /** @type {Object[]} */
    rows: {}
  },

  Union: {
    name: "Type Union",
    required: true,
    cols: TypeUnionColumns,
    /** @type {Object[]} */
    rows: {}
  },

  Metadata: {
    name: "Metadata",
    required: true,
    cols: MetadataColumns,
    /** @type {Object[]} */
    rows: {}
  }

};

let CONTENT_STYLES = ["object", "adapter", "association", "augmentation", "metadata", "CSC", "simple", "list", "union"];
let SIMPLE_BASES = ["xs:string", "xs:token"];
let FACET_KINDS = ["enumeration", "length", "minLength", "maxLength", "pattern",
"whiteSpace", "maxInclusive", "minInclusive", "maxExclusive", "minExclusive",
"totalDigits", "fractionDigits"];


module.exports = {
  tabs,
  TabType,
  CODES: ["add", "edit", "delete", "comment", "no change", "map", "subset", "no match", "documentation", "clear"],
  /** @type {"add"|"edit"|"delete"|"comment"|"no change"|"map"|"subset"|"no match"|"documentation"|"clear"} */
  CodeType: "",
  CONTENT_STYLES,
  FACET_KINDS
}