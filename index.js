const path = require('path');
const TestStream = require('test262-stream');
const Reporter = require('./report.js');
const report = new Reporter();

async function check({test, filters, execute}) {
  const {file} = test;

  if (filter(test, filters)) {
    try {
      test.result = await execute(test);
    } catch (err) {
      console.log('check failure', file, err);
    }
  } else {
    test.result = {
      skip: true
    };
  }

  report.dot(file);

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


module.exports = run;
