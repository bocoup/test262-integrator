const path = require('path');
const TestStream = require('test262-stream');
const Reporter = require('./report.js');
const report = new Reporter();

async function applyFilters(testObject, filters, execute) {
  testObject.file = path.relative('test', testObject.file);
  testObject.skip = false;
  testObject.result = {};

  if (!filter(testObject, filters)) {
    testObject.skip = true;
  }

  report.log(testObject);

  return testObject;
}

function filter({file, attrs}, filters) {
  // Filter tests by path location
  if (filters.paths.some(p => file.includes(p))) {
    return false;
  }

  // Filter tests by string type tags
  if (['esid', 'es6id', 'es5id'].some(tag => filters[tag] && filters[tag].includes(attrs[tag]))) {
    return false;
  }

  // Filter tests by tagged features
  if (filters.features &&
      attrs.features &&
      filters.features.some(feature => attrs.features.includes(feature))) {
    return false;
  }

  // Filter tests by flags (module, async, etc)
  if (attrs.flags && filters.flags.some(flag => attrs.flags[flag])) {
    return false;
  }

  return true;
}

async function run({ skipList, testDir }) {
  const results = [];
  const stream = new TestStream(testDir, {
    paths: ["test/built-ins/Array"]
  });

  stream.on('data', async testObject => {
    results.push(await applyFilters(testObject, skipList));
  });

  return new Promise((resolve, reject) => {
     stream.on('error', reject);
     stream.on('end', () => resolve(results) );
  });
}

module.exports.run = run;
module.exports.resultInterface = {
  pass: false,
  message: ''
};
