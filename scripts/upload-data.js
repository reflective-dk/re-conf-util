#!/usr/bin/env node

"use strict";

var inspect = require('util').inspect;
var path = require('path');
var buildObjects = require(path.join(__dirname, '../lib/build-objects'));
var conf = require(process.env.PWD); // Loads index.js of outer npm project

var ipfs = require('ipfs-api')('35.198.64.101', '5001');

conf.resolve()
    .then(cnf => {
        return cnf.upload(ipfs);
    })
    .then(results => {
        var out = {};
        results.forEach(r => out[r[0].hash] = r[0].size);
        console.log(out);
    })
    .catch(function(errors) {
        console.log('operation failed:');
        console.log(inspect(errors, null, null));
    });
