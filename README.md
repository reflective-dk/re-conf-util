## Configuration project utilities ##

Use this module to create deplyable configuration modules for specific customers
or functionality.

### Example ###

The `re-models` project uses this module to create a deployable
configuration. It's `index.js` file looks like this:

```
"use strict";

var path = require('path');
var rootLoc = path.dirname(require.resolve('./index.js'));
var confLoc = path.join(rootLoc, 'models');
var dataLoc = path.join(rootLoc, 'data');

var confUtil = require('re-conf-util');

module.exports = confUtil.prepareConf(confLoc, dataLoc, 'model');
```

### Usage ###

Simply pull in this module as a dependency and use `prepareConf()` as above. If
you're creating a configuration module that depends on other configurations,
simple `require` them into your `index.js` and include them in the call:

```
var extraConf = require('extra-conf');

module.exports = confUtil.prepareConf(confLoc, dataLoc, 'model', [ extraConf ]);
```

### Functionality ###

Configurations prepared in this way can be used in two ways:

1. They can be `require`'d as regular dependencies if you just need to reference
   their contents in code:

   ```
   var myConf = require('my-conf');
   
   function something() {
       someOperation(myConf.model.foo.classes.bar.id);
   }
   ```

2. Having `require`'d a configuration, you can call the `resolve()` promise
   function which will load any data files into buffers and replace dynamic hash
   links in the configuration objects. The resolved conf structure is as
   follows:

   ```
   myConf.resolve().then(resolved) yields:
   resolved = {
       name: 'my-conf',
       model: { foo: {
           classes: { bar: { /* bar class */ } },
           instances: { bar: { /* bar instances */ } }
       } },
       state: { 'test-conf': [ /* bar class and instances */ ] },
       data: [ /* Buffers of data */ ]
   };
   ```

Look at `test/end-to-end-test.js` for more information.
