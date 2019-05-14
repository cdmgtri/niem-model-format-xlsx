
let TabInfo = {
  /** @type {String} name */
  name: undefined,

  /** @type {Object[]} */
  rows: undefined,

  /** @type {Object<string, ColInfo>} */
  cols: undefined,

  /** @type {"data"|"info"} style */
  style: undefined,

  /** @type {Boolean} implemented */
  implemented: undefined,

  /** @type {Boolean} implemented */
  required: undefined
};

let TypeCols = {
  OldQName: "Old Qualified Type Name",
  Code: "Change Code",
  NewNS: "New NS",
  NewName: "New Type Name",
  NewDefinition: "Definition",
  NewBase: "Qualified Parent / Base Type",
  ContentStyle: "Content Style\r\n(CCC, CSC, or S)",
  IsAssociation: "Is Association?\r\n(default=FALSE)",
  IsAugmentation: "Is Augmentation?\r\n(default=FALSE)",
  IsAdapter: "Is Adapter?\r\n(default=FALSE)",
  IsMetadata: "Is Metadata?\r\n(default=FALSE)"
};

let FacetCols = {
  OldTypeQName: "Old Qualified Type",
  OldValue: "Old Facet Value",
  OldDefinition: "Old Definition",
  Code: "Change Code",
  NewTypeQName: "New Qualified Type",
  NewValue: "New Facet Value",
  NewDefinition: "Definition",
  NewKind: "Kind of Facet\r\n(default=enumeration)"
};

let cr = {
  Readme: {
    name: "Readme",
    rows: {},
    cols: {},
    style: "data",
    implemented: false,
    required: false
  },

  ChangeDescription: {
    name: "ChangeDescription",
    rows: {},
    cols: {},
    style: "data",
    implemented: false,
    required: false
  },

  Property: {
    name: "Property",
    rows: {},
    cols: {},
    style: "data",
    implemented: false,
    required: false
  },

  Type: {
    name: "Type",
    /** @type {Object[]} */
    rows: undefined,
    cols: TypeCols,
    /** @type {String[]} */
    typeQNames: [],
    /** @type {String[]} */
    cccTypeQNames: [],
    /** @type {String[]} */
    cscTypeQNames: [],
    /** @type {String[]} */
    simpleTypeQNames: [],
    style: "data",
    implemented: true,
    required: true
  },

  TypeContainsProperty: {
    name: "TypeContainsProperty",
    rows: {},
    cols: {},
    style: "data",
    implemented: false,
    required: false
  },

  Facet: {
    name: "Facet",
    /** @type {Object[]} */
    rows: undefined,
    cols: FacetCols,
    /** @type {Set<string>} */
    typeQNames: [],
    /** @type {Set<string>} */
    enumTypeQNames: [],
    style: "data",
    implemented: true,
    required: true,
  },

  Namespace: {
    name: "Namespace",
    rows: {},
    cols: {},
    style: "data",
    implemented: false,
    required: false
  },

  LocalTerminology: {
    name: "LocalTerminology",
    rows: {},
    cols: {},
    style: "data",
    implemented: false,
    required: false
  },

  Union: {
    name: "Union",
    rows: {},
    cols: {},
    style: "data",
    implemented: false,
    required: false
  }

};

module.exports = {
  cr,
  TabInfo
}