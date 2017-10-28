const path = require('path');
const TestStream = require('test262-stream');
const Reporter = require('./report.js');
const report = new Reporter();

async function check({test, filters, execute}) {
  test.skip = false;

  if (filter(test, filters)) {
    try {
      test = await execute(test);
    } catch (e) {
      console.log('check failure', test.file, e);
    }
  } else {
    test = skipTest(test);
  }

  report.dot(test);

  return test;
}

function filter({file, attrs}, filters) {
  // Filter tests by path location
  if (filters.paths && filters.paths.some(p => file.includes(p))) {
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
  if (attrs.flags && filters.flags && filters.flags.some(flag => attrs.flags[flag])) {
    return false;
  }

  return true;
}

async function run({ filters, execute, testDir, paths }) {
  const results = [];
  const stream = new TestStream(testDir, { paths });

  stream.on('data', async test => {
    results.push(await check({test, filters, execute}));
  });

  return new Promise((resolve, reject) => {
    stream.on('error', reject);
    stream.on('end', () => {
      resolve(results);
    });
  });
}

function applyResult(test, pass, error) {
  return Object.assign(test, {
    result: { pass, error }
  });
}

function skipTest(test) {
  return Object.assign(test, {skip: true});
}

module.exports = run;
module.exports.applyResult = applyResult;
module.exports.skipTest = skipTest;
