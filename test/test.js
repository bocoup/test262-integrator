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
    paths: ['test/built-ins/Array/from']
  });
}).then(
  processResults,
  err => console.error(`Error running the tests: ${err}`)
);

function processResults(results) {
  const total = results.length;
  let skipped = 0;
  let passed = 0;

  results.forEach(({result: { pass, skip } = {}}) => {
    if (skip) {
      skipped++;
    }
    if (pass) {
      passed++;
    }
  });
  console.log(`Skipped: ${skipped}, Passed: ${passed}, Total: ${total}\n`);
}
