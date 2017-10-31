# Test262-Integrator

Integrates any project the [test262-stream](https://github.com/bocoup/test262-stream) API with any ES host execution applying filters from a JS object.

## Install

```shell
npm install --save-dev test262-integrator
```


## Usage

```js
const Integrator = require('test262-integrator');

Integrator({
  testDir, // String: the path where Test262 is located.
  execute, // (Async/Sync) Function: this function is called for every non-skipped test file, the
           // return should be a result object.
  filters, // (Optional) Object: a list of filters, see 'test/filters.yml' for an example.
  paths: ['test/built-ins/Array/from'] // (Optional) Array of Strings: specifies exclusive paths to
                                       // run the test.
}).then(results => {
  // `results` is an Array of objects containing information on all the tests object captured from
  // the stream, plus a `result` property with the results captured from execution.

  // Tests skipped from the filtering list will have a `result = { skip: true }` property.

  // Anything returned from the `execute` method will be stored in the result property.
}, err => {
  // Any execution error will be available here
});

// The execute function signature:
function execute(test) {
  // `test` has the same properties used in [test262-stream](https://github.com/bocoup/test262-stream#usage)

  // This function can return a promise for async operations.
}
```

## Filters

A the `filters` object can be loaded from any configuration file - e.g: a yaml file - and is a list connected to a test metadata or path location.

All the listed matching items will be flagged as skipped.

Example:

```js
const filters = {
  // Filters by metadata:
  features: [
    'tail-call-optimization',
    'SharedArrayBuffer',
  ],
  esid: ['pending'],
  es5id: ['15.1.2.2_A8', '15.1.2.3_A6'],
  es6id: ['22.1.3.1_3'],
  flags: ['module', 'async'],

  // Filters by path location:
  paths: [
    // filters will apply to any match, as long as the path contains the string from any index.
    // In this example, any file path containing `harness` will be skipped.
    'harness',
    'intl402',
    'built-ins/Function/prototype/toString/',
    'built-ins/SharedArrayBuffer/',
    'built-ins/Atomics/',
    'annexB/',
  ],
};
```
