const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const { run } = require('../index.js');
const { createAgent } = require('eshost');

const testDir = path.join(__dirname, '../..', 'test262');
const filters = yaml.safeLoad(fs.readFileSync(path.join(__dirname, './filters.yml'), 'utf8'));


Promise.all([
  createAgent('node', {
    hostPath: '/usr/local/bin/node' ,
    shortName: '$262',
  })
]).then(([agent]) => {
  async function execute({contents, file}) {
    let pass = false;
    let message = '';
  
    const result = await agent.evalScript(contents);
  
    // TODO: is this supposed to be an error?
    if (result.error) {
      // ...
    }
    return result;
  }
  return run({
    filters,
    testDir,
    execute,
    paths: ['test/language/expressions/class']
  })
}).then(tests => {
  // TODO: categorize folders, etc etc statistics everything
});
