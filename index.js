const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const { run, resultInterface } = require('./integration.js');
const Prepack = require('prepack');

const testDir = path.join(__dirname, '..', 'test262');
const skipList = yaml.safeLoad(fs.readFileSync(path.join(__dirname, './filters.yml'), 'utf8'));

function execute(testObject) {
  // TODO: load host and execute the test for real

  let idk;

  try {
    console.log(testObject.contents);
    console.log('------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------')
    idk = Prepack.prepack(testObject.contents);
    console.log('a', idk.code);
  } catch(e) {
    //console.log(e.message);
  }

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
