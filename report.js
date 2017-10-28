const path = require('path');

class Report {
  constructor() {
    this.folders = new Set();
  }

  dot({file, skip}) {
    const folder = path.dirname(file);

    // Register each new folder with tests
    if (!this.folders.has(folder)) {
      this.folders.add(folder);
      this.print('.');
    }
  }

  print(text) {
    return process.stdout.write(text);
  }
}

module.exports = Report;
