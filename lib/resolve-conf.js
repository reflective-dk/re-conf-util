"use strict";

var _ = require('lodash');
var visitConfObjects = require('./util').visitConfObjects;
var remapHashes = require('./remap-hashes');

module.exports = resolveConf;

function resolveConf(conf, dataMap, depConfs) {
    return remapHashes(conf, dataMap).then(function() {
        conf.state = buildState(conf, depConfs);
        conf.data = buildData(conf, dataMap, depConfs);
        return conf;
    });
}

function buildState(conf, depConfs) {
    var objects = [];
    visitConfObjects(conf.model, o => objects.push(o));
    var state = {};
    state[conf.name] = objects;
    depConfs.forEach(dep => _.assign(state, dep.state));
    return state;
}

function buildData(conf, dataMap, depConfs) {
    var buffers = Object.keys(dataMap).map(k => dataMap[k]);
    depConfs.forEach(dep => buffers = buffers.concat(dep.data || []));
    return buffers;
}
