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
  async function execute({contents, attrs: { flags: { async }}}) {
    let pass = false;
    let message = '';

    const result = await agent.evalScript(contents, {async});

    return result;
  }
  return Integrator({
    filters,
    testDir,
    execute,
    paths: ['test/language/expressions']
  })
}, err => console.error(err)).then(tests => {
  return console.log(`Done`);
}, err => console.error(err));
