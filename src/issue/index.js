
class Issue {

  /**
   * @param {string} tabName
   * @param {string} row
   * @param {string} col
   * @param {string} label
   * @param {string} test
   * @param {string} description
   */
  constructor(tabName, row, col, label, test, description) {
    this.Tab = tabName;
    this.Row = row;
    this.Col = col;
    this.Label = label;
    this.Category = test;
    this.Description = description;
  }

}

module.exports = Issue;
