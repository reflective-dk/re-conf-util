#!/usr/bin/env node

"use strict";

var inspect = require('util').inspect;
var fs = require('fs');
var path = require('path');
var buildObjects = require(path.join(__dirname, '../lib/build-objects'));
var conf = require(process.env.PWD); // Loads index.js of outer npm project

buildObjects(conf)
    .then(function(objects) {
        var output = JSON.stringify({ objects: objects }, null, 2);
        try { fs.mkdirSync('build'); } catch(e) {}
        fs.writeFileSync(path.join(process.env.PWD, 'build/objects.json'), output);
    })
    .catch(function(errors) {
        console.log('Operation failed:');
        console.log(inspect(errors, null, null));
    });
