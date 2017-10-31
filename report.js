const path = require('path');

class Report {
  constructor() {
    this.folders = new Set();
  }

  dot(file, verbose) {
    const folder = path.dirname(file);

    if (!verbose && !this.folders.has(folder)) {
      // Register each new folder with tests
      this.folders.add(folder);
      this.print('.');
    } else {
      if (!this.folders.has(folder)) {
        this.folders.add(folder);
        this.print(`\n${folder}\n`);
      }
      this.print('.');
    }
  }

  print(text) {
    return process.stdout.write(text);
  }
}

module.exports = Report;
