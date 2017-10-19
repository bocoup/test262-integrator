const path = require('path');
const chalk = require('chalk');

class Report {
  constructor() {
    this.folders = new Set();
  }
  log({file, skip, result: { pass, message }}) {
    const folder = path.dirname(file);

    if (!this.folders.has(folder)) {
      this.folders.add(folder);
      this.print('.');
    }

    if (!skip && !pass) {
      this.print(chalk.red('F'));
      console.log(file, message);
    }
  }

  print(text) {
    process.stdout.write(text);
  }
}

module.exports = Report;
