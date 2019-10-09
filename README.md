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

#### As dependency ####

They can be `require`'d as regular dependencies if you just need to reference
their contents in code:

```
var myConf = require('my-conf');

function something() {
    someOperation(myConf.model.foo.classes.bar.id);
}
```

When used in this fashion, all objects in the model are enriched to this
structure for convenience:

```
{
  id: 'some-id',
  name: 'name if available, else id',
  snapshot: { /* payload */ },
  registrations: [ { validity: [ { input: { /* payload */ } } ] } ],
  ref: { id: 'object id', name: 'object name' }
}
```

#### As repository for data and objects ####
Having `require`'d a configuration, you can call the `resolve()` promise function
which will load any data files into buffers and replace dynamic hash links in the
configuration objects. The resolved conf structure is as follows:

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

## Puppeteer and Chromium ##
Install Chromium on amazon t2 instance

```sh
echo '[google-chrome]
name=google-chrome
baseurl=http://dl.google.com/linux/chrome/rpm/stable/$basearch
enabled=1
gpgcheck=1
gpgkey=https://dl-ssl.google.com/linux/linux_signing_key.pub' > /etc/yum.repos.d/google-chrome.repo 

sudo yum install cups-libs dbus-glib libXrandr libXcursor libXinerama cairo cairo-gobject pango
# Install ATK from CentOS 7
sudo rpm -ivh --nodeps http://mirror.centos.org/centos/7/os/x86_64/Packages/atk-2.28.1-1.el7.x86_64.rpm
sudo rpm -ivh --nodeps http://mirror.centos.org/centos/7/os/x86_64/Packages/at-spi2-atk-2.26.2-1.el7.x86_64.rpm
sudo rpm -ivh --nodeps http://mirror.centos.org/centos/7/os/x86_64/Packages/at-spi2-core-2.28.0-1.el7.x86_64.rpm
sudo rpm -ivh --nodeps http://mirror.centos.org/centos/7/os/x86_64/Packages/xdg-utils-1.1.0-0.17.20120809git.el7.noarch.rpm
sudo rpm -ivh --nodeps http://mirror.centos.org/centos/7/os/x86_64/Packages/liberation-fonts-1.07.2-16.el7.noarch.rpm
# Install GTK from fedora 20
sudo rpm -ivh --nodeps http://dl.fedoraproject.org/pub/archive/fedora/linux/releases/20/Fedora/x86_64/os/Packages/g/GConf2-3.2.6-7.fc20.x86_64.rpm
sudo rpm -ivh --nodeps http://dl.fedoraproject.org/pub/archive/fedora/linux/releases/20/Fedora/x86_64/os/Packages/l/libXScrnSaver-1.2.2-6.fc20.x86_64.rpm
sudo rpm -ivh --nodeps http://dl.fedoraproject.org/pub/archive/fedora/linux/releases/20/Fedora/x86_64/os/Packages/l/libxkbcommon-0.3.1-1.fc20.x86_64.rpm
sudo rpm -ivh --nodeps http://dl.fedoraproject.org/pub/archive/fedora/linux/releases/20/Fedora/x86_64/os/Packages/l/libwayland-client-1.2.0-3.fc20.x86_64.rpm
sudo rpm -ivh --nodeps http://dl.fedoraproject.org/pub/archive/fedora/linux/releases/20/Fedora/x86_64/os/Packages/l/libwayland-cursor-1.2.0-3.fc20.x86_64.rpm
sudo rpm -ivh --nodeps http://dl.fedoraproject.org/pub/archive/fedora/linux/releases/20/Fedora/x86_64/os/Packages/g/gtk3-3.10.4-1.fc20.x86_64.rpm
# Install Gdk-Pixbuf from fedora 16
sudo rpm -ivh --nodeps http://dl.fedoraproject.org/pub/archive/fedora/linux/releases/16/Fedora/x86_64/os/Packages/gdk-pixbuf2-2.24.0-1.fc16.x86_64.rpm
#Lib indicator
sudo rpm -ivh --nodeps http://ftp.altlinux.org/pub/distributions/ALTLinux/Sisyphus/x86_64/RPMS.classic//libappindicator-gtk3-12.10.0-alt11.x86_64.rpm

sudo yum install google-chrome-stable
```

Install chromium
```sh
npm install chromium -g
```

Reference in test suite by setting executablePath

```sh
const { runQunitPuppeteer, printOutput } = require('re-conf-util/lib/qunit-runner');

function runATest(args) {
  logger.info('testing', args.qunitTestPath);
  let runArgs = {
    redirectConsole: false,
    testDataDir: __dirname + '/data/',
    targetUrl: args.qunitTestPath,
    puppeteerArgs: ['--allow-file-access-from-files', '--no-sandbox']
  };

  runArgs.executablePath ='/usr/bin/chromium-browser';

  return runQunitPuppeteer(runArgs)
  .then((result) => {
    if (result.stats.failed !== 0) {
      console.error(util.inspect(result, { showHidden: false, depth: 10 }));
    }
    assert.equal(result.stats.failed, 0);
  });
}
```
