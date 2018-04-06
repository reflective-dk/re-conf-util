#!/usr/bin/env node

"use strict";

var fs = require('fs');
var ipfs = require('ipfs-api')('35.198.64.101', '5001');
var through2 = require('through2');

var name = process.argv[2];

if (!name) {
    console.log('usage: binadd <path/to/file>');
    process.exit(1);
}

// Note We pipe the stream through a blank through2 stream below in order to hide
// from IPFS that it's working on a file stream.
ipfs.files.add(fs.createReadStream(name).pipe(through2()))
    .then(function(result) {
        console.log(name, result);
    });
