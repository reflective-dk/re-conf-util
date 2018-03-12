"use strict";

var Promise = require('bluebird');
var _ = require('lodash');
var visitConfObjects = require('./util').visitConfObjects;
var remapHashes = require('./remap-hashes');

module.exports = resolveConf;

function resolveConf(conf, dataMap, depConfs) {
    return Promise.map(depConfs, dc => dc.resolve())
        .then(function(deps) {
            return remapHashes(conf, dataMap).then(function() {
                conf.state = buildState(conf, deps);
                conf.data = buildData(conf, dataMap, deps);
                return conf;
            });
        });
}

function buildState(conf, depConfs) {
    var objects = [];
    visitConfObjects(conf, o => objects.push(o));
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
