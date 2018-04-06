#!/usr/bin/env node

"use strict";

var ipfs = require('ipfs-api')('35.198.64.101', '5001');

var hash = process.argv[2];

if (!hash) {
    console.log('usage: binget <multihash>');
    process.exit(1);
}

ipfs.files.catReadableStream('/ipfs/' + hash)
    .pipe(process.stdout);
