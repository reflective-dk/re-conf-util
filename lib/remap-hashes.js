"use strict";

var Promise = require('bluebird');
var ipfsHash = require('./ipfs-hash');
var visitConfObjects = require('./util').visitConfObjects;
var visitEachAttribute = require('./util').visitEachAttribute;

module.exports = remapHashes;
module.exports.remapObject = remapObject; // Expose for testability

function remapHashes(conf, dataMap) {
    var keys = Object.keys(dataMap);
    var buffers = keys.map(k => dataMap[k]);
    var hashes = Promise.map(buffers, b => ipfsHash(b));
    visitConfObjects(conf, o => remapObject(o, keys, hashes));
}

function remapObject(obj, keys, hashes) {
    visitEachAttribute(obj, att => remapAttribute(att, keys, hashes));
    return obj;
}

function remapAttribute(att, keys, hashes) {
    att = att || {};
    if (typeof att != 'object') {
        return;
    }
    // Replace if matching single reference
    var i = keys.indexOf(att.hash);
    if (i > -1) { att.hash = hashes[i]; }
    // Replace if matching multi reference
    Object.keys(att).forEach(k => {
        var a = att[k];
        var n = keys.indexOf(a.hash);
        if (n > -1) { a.hash = hashes[n]; }
    });
}
