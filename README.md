
# NIEM Change Request (CR) QA

This project runs QA tests on a NIEM Change Request spreadsheet.

## Steps

- [x] Read spreadsheet
- [x] Basic QA
  - [x] Check tab names
  - [x] Check column headers
  - [x] Change description
  - [x] Change codes
  - [x] Required fields per change code / component style
  - [x] Check for local duplicates
  - [x] Check that local references exist
- [ ] Compare against NIEM
  - [ ] Check that NIEM references exist
  - [ ] Check that NIEM components are not duplicated
  - [ ] Check for basic harmonization (same name, different namespace)
- [ ] Misc
  - [x] Add facet kind to label
  - [ ] Add 1 to rownum
  - [ ] Add warning vs error to results
  - [ ] Set up test details better
  - [ ] Set up as class
  - [ ] CLI
- [x] Save results to spreadsheet
- [ ] Use template to save results
  - [ ] Try reading tab, adding data, and writing back out
- [ ] CI
  - [ ] Jest
  - [ ] Travis
  - [ ] Coveralls
- [ ] Add UI
  - [ ] upload spreadsheet
  - [ ] display results
  - [ ] download results
  - [ ] status info
- [ ] Apply changes into NIEM model

## Implemented Tabs

- [ ] Property
- [ ] Type
  - [x] Simple (adds only)
  - [x] CSC (adds only)
  - [ ] CCC
- [ ] Type contains property
- [x] Facet (adds only)
- [ ] Namespace
- [ ] Local Terms
- [ ] Union
