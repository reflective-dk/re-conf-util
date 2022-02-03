"use strict";

var Promise = require('bluebird');
var IPFS = require('./ipfs-hash');
var visitConfObjects = require('./util').visitConfObjects;
var visitEachAttribute = require('./util').visitEachAttribute;

module.exports = remapHashes;
module.exports.remapObject = remapObject; // Expose for testability

function remapHashes(conf, dataMap) {
    var keys = Object.keys(dataMap);
    var buffers = keys.map(k => dataMap[k]);
    return IPFS.start().then(function (ipfs) {
      return Promise.map(buffers, b => ipfs.hash(b)).then(hashes => {
          visitConfObjects(conf, o => remapObject(o, keys, hashes));
      }).tap(function () {
        return ipfs.stop();
      });
    });
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
    if (i > -1) {
        att.key = att.hash;
        att.hash = hashes[i];
    }
    // Replace if matching multi reference
    Object.keys(att).forEach(k => {
        var a = att[k];
        if (a) {
            var n = keys.indexOf(a.hash);
            if (n > -1) {
                a.key = a.hash;
                a.hash = hashes[n];
            }
        }
    });
}
