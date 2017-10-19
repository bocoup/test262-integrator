const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const { run, resultInterface } = require('./integration.js');

const testDir = path.join(__dirname, '..', 'test262');
const skipList = yaml.safeLoad(fs.readFileSync(path.join(__dirname, './filters.yml'), 'utf8'));

let lastDirName = '';
function execute(testObject) {
  // TODO: load host and execute the test for real
  return Object.assign({}, resultInterface, {
    pass: true, // if pass
    // message: '', // if any
  })
}

run({
  skipList,
  execute,
  testDir
}).then(results => {
  console.log(`Done!`);
});
