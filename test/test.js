const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const Integrator = require('../src/index.js');
const { createAgent } = require('eshost');

const testDir = path.join(__dirname, '../..', 'test262');
const filters = yaml.safeLoad(fs.readFileSync(path.join(__dirname, './filters.yml'), 'utf8'));

createAgent('node', {
  hostPath: '/usr/local/bin/node',
  shortName: '$262',
}).then(agent => {
  async function execute({contents, negative, attrs: { flags: { async }}}) {
    const { stdout, error } = await agent.evalScript(contents, {async});
    return {
      // TODO: improve
      pass: stdout.includes('test262/done') && !negative,
      error
    };
  }
  return Integrator({
    filters,
    testDir,
    execute,
    verbose: true,
    paths: ['test/language/statements/class']
  });
}).then(
  processResults,
  err => console.error(`Error running the tests: ${err}`)
);

function processResults(results) {
  const total = results.length;
  let skipped = 0;
  let passed = 0;
  const folders = new Map();

  console.log('\n');

  results.forEach(({file, result: { pass, skip, error } = {}}) => {
    const folder = path.dirname(file).split(path.sep).slice(1, 5).join(path.sep);
    let data;
    if (!folders.has(folder)) {
      data = {
        skipped: 0,
        passed: 0,
        total: 0
      };
      folders.set(folder, data);
    } else {
      data = folders.get(folder);
    }

    if (skip) {
      data.skipped++;
      skipped++;
    }
    if (pass) {
      data.passed++;
      passed++;
    } else if (!skip) {
      console.log(`Failed: ${file}\n${error && error.message}\n`);
    }

    data.total++;
  });

  folders.forEach(printResult);

  // Print total results
  printResult({ skipped, passed, total }, '\nTotal');
}

function printResult({skipped, passed, total}, name) {
  const subtotal = total - skipped;
  const failed = subtotal - passed;
  console.log([
    `${name}: `,
    `Ran ${subtotal}/${total} (${percentage(subtotal, total)}), `,
    `Passed ${passed}/${subtotal} (${percentage(passed, subtotal)}), `,
    `Failed ${failed}/${subtotal} (${percentage(failed, subtotal)}), `,
    `Skipped ${skipped}/${total} (${percentage(skipped, total)})`,
  ].join(''));
}

function percentage(x, total) {
  if (total === 0) {
    return '100%';
  }
  return (x / total * 100).toFixed(2) + '%';
}