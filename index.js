const path = require('path');
const TestStream = require('test262-stream');
const Reporter = require('./report.js');
const report = new Reporter();

async function check({test, filters, execute}) {
  test.file = path.relative('test', test.file);
  test.skip = false;

  if (filter(test, filters)) {
    // If execute returns a promise, unwrap it.
    test.result = await execute(test);
  } else {
    test.result = {};
    test.skip = true;
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
      report.final(results);
      resolve(results);
    });
  });
}

module.exports.run = run;

/**
 * Describes the result like in the eshost project:
 * https://github.com/bterlson/eshost#result-object
 *
 * {
 *   stdout: (String) anything printed to stdout (mostly what you print using print).
 *   stderr: (String) anything printed to stderr
 *
 *   // If the script threw an error, it will be an error object. Else, it will be null.
 *   error: {
 *     name: (String) Error name (eg. SyntaxError, TypeError, etc.)
 *     message: (String) Error message
 *     stack: (Array) A list of stack frames.
 *   }
 * }
 */
module.exports.resultInterface = {
  stdout: '',
  stderr: '',
  error: null
};
