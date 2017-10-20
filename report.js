const path = require('path');

class Report {
  constructor() {
    this.folders = new Set();
  }

  dot({file, skip: { pass, message }}) {
    const folder = path.dirname(file);

    // Register each new folder with tests
    if (!this.folders.has(folder)) {
      this.folders.add(folder);
      this.print('.');
    }
  }

  final(results) {
    // TODO: Report general results, an array of test objects with the
    // result property on each
    // map results for passed/failed/total

    // TODO: improve
    const total = results.length;
    const skipped = results.reduce(
      ((count, {skip}) => skip ? count++ : count),
      0
    );

    const err = results.reduce(
      ((count, {result: {error}}) => error ? count++ : count),
      0
    );
    return this.print(`Done! Skipped: ${skipped}, Error: ${err}, Total: ${total}`);
  }

  print(text) {
    return process.stdout.write(text);
  }
}

module.exports = Report;
