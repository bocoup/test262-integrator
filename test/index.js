const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const { run, resultInterface } = require('../index.js');
const { createAgent } = require('eshost');

const testDir = path.join(__dirname, '../..', 'test262');
const skipList = yaml.safeLoad(fs.readFileSync(path.join(__dirname, './filters.yml'), 'utf8'));

createAgent('node', {
  hostPath: '/usr/local/bin/node' ,
  shortName: '$262',
});

function execute(test) {
  let pass = false;
  let message = '';

  try {
    const { realm } = createRealm(10000);
    const result = realm.$GlobalEnv.execute(test.contents);

    console.log(result);
    pass = true;
  } catch(e) {
    message = e.message;
  }

  return Object.assign({}, resultInterface, {
    pass, // if pass
    message, // if any
  });
}

run({
  skipList,
  testDir
}).then(tests => {
  // TODO: Report results
  console.log(`Done! ${tests.length}`);
});
