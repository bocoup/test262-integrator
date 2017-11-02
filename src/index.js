const path = require('path');
const TestStream = require('test262-stream');
const Reporter = require('./report.js');
const report = new Reporter();

async function check({test, filters, execute, verbose}) {
  const {file} = test;

  report.dot(file, verbose);

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

  // Filter negative tests by their phase.
  if (attrs.negative && filters.negative) {
    const { type, phase } = attrs.negative;
    const { type: types, phase: phases } = filters.negative;
    if (phases && phases.includes(phase)) {
      return false;
    }

    if (types && types.includes(type)) {
      return false;
    }
  }

  return true;
}

async function run({ filters, execute, testDir, paths, verbose }) {
  const results = [];
  const stream = new TestStream(testDir, { paths });
  const resolveds = [];

  stream.on('data', test => {
    resolveds.push(
      new Promise(resolve => {
        check({test, filters, execute, verbose}).then(resolve)
      })
    );
  });

  return new Promise((resolve, reject) => {
    stream.on('error', reject);
    stream.on('end', () => {
      Promise.all(resolveds).then(results => resolve(results));
    });
  });
}


module.exports = run;
