const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const { run, resultInterface } = require('./integration.js');
const Prepack = require('prepack');

const testDir = path.join(__dirname, '..', 'test262');
const skipList = yaml.safeLoad(fs.readFileSync(path.join(__dirname, './filters.yml'), 'utf8'));

var prepend = `
function print(arg) {
  return console.log(arg);
}

var $262 = {
  destroy: function() {}
};
`;

function execute(testObject) {
  // TODO: load host and execute the test for real

  let idk;
  let pass = false;
  let message = '';

  try {
    idk = Prepack.prepack(prepend + testObject.contents);
    pass = true;
  } catch(e) {
    //console.log(e.message);
  }

  return Object.assign({}, resultInterface, {
    pass, // if pass
    message, // if any
  });
}

run({
  skipList,
  execute,
  testDir
}).then(results => {
  console.log(`Done!`);
});
