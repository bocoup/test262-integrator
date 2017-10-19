const path = require('path');

class Report {
  constructor() {
    this.folders = new Set();
  }
  log({file, skip}) {
    const folder = path.dirname(file);

    if (!this.folders.has(folder)) {
      this.folders.add(folder);
      this.print('.');
    }
  }

  print(text) {
    process.stdout.write(text);
  }
}

module.exports = Report;
