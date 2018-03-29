"use strict";

var Promise = require('bluebird');
var _ = require('lodash');
var visitConfObjects = require('./util').visitConfObjects;
var remapHashes = require('./remap-hashes');

module.exports = resolveConf;

function resolveConf(conf, dataMap, depConfs, miscMap) {
    return Promise.map(depConfs || [], dc => dc.resolve())
        .then(function(deps) {
            return remapHashes(conf, dataMap)
                .then(function() {
                    return buildState(conf, deps);
                })
                .then(function(state) {
                    conf.state = state;
                    conf.data = buildData(conf, dataMap, deps);
                    return conf;
                });
        })
        .then(function() {
            return buildMisc(miscMap);
        })
        .then(function(misc) {
            conf.misc = misc;
            return conf;
        });
}

function buildState(conf, depConfs) {
    var objects = [];
    visitConfObjects(conf, o => objects.push(o));
    var state = {};
    depConfs.forEach(dep => _.assign(state, dep.state));
    state[conf.name] = objects;
    return checkState(state, conf.name);
}

function buildMisc(miscMap) {
    var containers = Object.keys(miscMap).map(k => JSON.parse(miscMap[k].toString()));
    return [].concat.apply([], containers.map(c => c.objects));
}

function checkState(state, confName) {
    var duplicates = [];
    var unique = {};
    Object.keys(state).map(s => state[s]).forEach(oo => oo.forEach(o => {
        if (unique[o.id]) {
            duplicates.push({ id: o.id, name: o.registrations[0].validity[0].input.name });
        }
        unique[o.id] = true;
    }));
    var namedDup = {};
    namedDup[confName] = duplicates;
    return duplicates.length ?
        Promise.reject({ duplicates: namedDup }) : Promise.resolve(state);
}

function buildData(conf, dataMap, depConfs) {
    var buffers = Object.keys(dataMap).map(k => dataMap[k]);
    depConfs.forEach(dep => buffers = buffers.concat(dep.data || []));
    return buffers;
}
