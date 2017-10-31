const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const Integrator = require('../index.js');
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
    paths: ['test/built-ins/DataView']
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

  results.forEach(({file, result: { pass, skip, error } = {}}) => {
    const folder = path.dirname(file);
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
      console.log(`Failed: ${file}\n${error.name}: ${error.message}\n`);
    }

    data.total++;
  });

  folders.forEach(({skipped, passed, total}, folder) => {
    console.log(`${folder}: Passed: ${passed}/${total} (${porcentage(passed, total)}%), Skipped: ${skipped} (${porcentage(skipped, total)}%)`);
  });
  console.log(`\nPassed: ${passed}/${total} (${porcentage(passed, total)}%), Skipped: ${skipped} (${porcentage(skipped, total)}%)\n`);
}

function porcentage(x, total) {
  return (x / total * 100).toFixed(2);
}