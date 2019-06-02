
# NIEM Mapping

This project provides support for spreadsheets following the NIEM Mapping template.

## Features

### Check format

A spreadsheet must follow the NIEM Mapping template in order to be processed.  These checks ensure that the format is correct and that required values have been provided.

- Check for required tabs
- Check for required columns
- Check for required values
- Check for valid mapping codes
- Check that name columns do not have qualified values
- Check that qname columns do have qualified values

### Load data

Loads data from the spreadsheet into reusable NIEM model objects.

*Status: Currently only loads data for `add` operations from the `Type`, `Codes`, and `Namespace` tabs.*

### NIEM QA tests

Runs NIEM QA tests on the loaded data.  QA tests run on NIEM model objects and are located in their own project for better reusability.  See [niem-qa](https://github.com/cdmgtri/niem-qa) for more.

*Status: Currently only implements tests for types (CSC and simple only) and facets.*

## Test Suite

Review the [tests.xlsx](./tests.xlsx) spreadsheet to review tests and their implementation status.

*Status: Still under development*

## App

See the online [NIEM Mapping app](https://cdmgtri.github.io/niem-mapping-app/) for an easy user interface for the project.  Select one of the demos to try the project out with one of the sample spreadsheets.  The source code for the app is available at [niem-mapping-app](https://github.com/cdmgtri/niem-mapping-app).

## Installation

```sh
npm i cdmgtri/niem-mapping
```

## To Do

- [ ] Refactor `tests.xlsx`
  - [ ] Spreadsheet-specific tests should stay here
  - [ ] Model tests should move to niem-qa
- [ ] Info tab
  - [ ] Review the MPD catalog for additional fields
  - [ ] Add tests
- [ ] Review code
- [ ] Save and format results
- [ ] Add usage info to this README

## Implemented Tabs

- [ ] Info
- [ ] Property
- [ ] Type
  - [x] Simple (adds only)
  - [x] CSC (adds only)
  - [ ] CCC
  - [ ] Simple list
  - [ ] Simple union
- [ ] Type contains property
- [x] Facet (adds only)
- [ ] Namespace
- [ ] Local Terms
- [ ] Union
