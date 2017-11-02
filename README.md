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
  execute, // (Async/Sync) Function: this function is called for 
           // every non-skipped test file, the return should be a 
           // result object.
  filters, // (Optional) Object: a list of filters, see 'test/filters.yml' 
           //  for an example.
  paths: ['test/built-ins/Array/from'] // (Optional) Array of Strings: 
                                       // specifies exclusive paths to
                                       // run the test.
  verbose: // (Optional) Boolean: toggles a verbose mode for files 
           // execution (experimental).
}).then(results => {
  // `results` is an Array of objects. Each object contains all 
  // relevant information for a given test produced by the test stream, with
  // an additional `result` property which contains the results of
  // the execution. If a test was skipped via filtering parameters, the
  // value of result property is { skip: true }.

  // Anything returned from the `execute` method will be stored in the 
  // result property.
}, err => {
  // Any execution error will be available here
});

// The execute function signature:
function execute(test) {
  // `test` has the same properties used in test262-stream*

  // This function can return a promise for async operations.
}
```

\** [test262-stream](https://github.com/bocoup/test262-stream#usage)

## Filters

The `filters` object can include any properties known to [Test262](https://github.com/tc39/test262/blob/master/INTERPRETING.md#metadata), as well as a special `paths` property whose value is an array of string paths relative to `test262`. All test file paths that match entries in `paths` will be skipped. 

All tests that are matched by the filter object will have a property `results` whose value is `{ skip: true }`. 

Test262-Integrator recommends using a YAML file to store filters, as it's the most readable and maintainable format. 

### Examples

(See [test/filters.yml](test/filters.yml) for an extensive example)

## YAML Filter File 

```
features:
  - tail-call-optimization
  - generators
  - default-parameters
```


## JSON Filter File 

```
{
  "features": [
    "tail-call-optimization",
    "generators",
    "default-parameters"
  ]
}
```

## JavaScript Object Filter

```js
const filters = {
  features: [
    'tail-call-optimization',
    'generators',
    'default-parameters'
  ]
};
```


## More Extensive Example

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

  // Filter negative tests by any matching phases and type
  negative: {
    type: ['SyntaxError'],
    phase: [
      'early',
      'runtime',
    ],
  },
};
```
