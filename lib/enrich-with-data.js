"use strict";

var Promise = require('bluebird');
var ipfsHash = require('./ipfs-hash');
var visitConfObjects = require('./visit-conf-objects');
var visitEachAttribute = require('./visit-each-attribute');

module.exports = enrichWithData;
// Expose for testability
module.exports.decorateObject = decorateObject;

function enrichWithData(conf, dataMap) {
    var keys = Object.keys(dataMap);
    var buffers = keys.map(k => dataMap[k]);
    var hashes = Promise.map(buffers, b => ipfsHash(b));
    visitConfObjects(conf, o => decorateObject(o, keys, hashes));
    conf.data = buffers;
}

function decorateObject(obj, keys, hashes) {
    visitEachAttribute(obj, att => decorateAttribute(att, keys, hashes));
    return obj;
}

function decorateAttribute(att, keys, hashes) {
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
