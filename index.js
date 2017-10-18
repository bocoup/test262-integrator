const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const { run, resultInterface } = require('./integration.js');

const skipList = yaml.safeLoad(fs.readFileSync(path.join(__dirname, './filters.yml'), 'utf8'));

let count = 0;
function execute(testObject) {
  count++;
  // TODO: load host and execute the test for real
  return Object.assign({}, resultInterface, {
    pass: true, // if pass
    // message: '', // if any
  })
}

run(skipList, execute).then(results => {
  console.log(`Done! Ran ${count} tests out of ${results.length}`);
});
