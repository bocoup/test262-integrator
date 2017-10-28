const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const Integrator = require('../index.js');
const { createAgent } = require('eshost');

const testDir = path.join(__dirname, '../..', 'test262');
const filters = yaml.safeLoad(fs.readFileSync(path.join(__dirname, './filters.yml'), 'utf8'));


Promise.all([
  createAgent('node', {
    hostPath: '/usr/local/bin/node' ,
    shortName: '$262',
  })
]).then(([agent]) => {
  async function execute({contents, attrs: { flags: { async }}, file}) {
    let pass = false;
    let message = '';
  
    const result = await agent.evalScript(contents, {async});
  
    // TODO: is this supposed to be an error?
    if (result.error) {
      // ...
    }
    return result;
  }
  return Integrator({
    filters,
    testDir,
    execute,
    paths: ['test/language/expressions/class']
  })
}).then(tests => {
  const total = results.length;
  const skipped = results.reduce(
    ((count, {skip}) => skip ? count++ : count),
    0
  );

  const err = results.reduce(
    ((count, {result: {pass}}) => pass ? count : count++),
    0
  );
  return console.log(`Skipped: ${skipped}, Error: ${err}, Total: ${total}\n`);
});
