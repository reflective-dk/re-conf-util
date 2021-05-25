"use strict";

var Promise = require('bluebird');
var _ = require('lodash');
var visitConfObjects = require('./util').visitConfObjects;
var remapHashes = require('./remap-hashes');

module.exports = resolveConf;

function resolveConf(conf, dataMap, depConfs, miscMap, docsMap) {
    return Promise.map(depConfs || [], dc => dc.resolve())
    .then(function(deps) {
        return remapHashes(conf, dataMap)
            .then(function() {
                return buildState(conf, deps);
            })
            .then(function(state) {
                conf.state = state;
                conf.data = buildData(conf, dataMap, deps);
                conf.docs = buildDocs(conf, docsMap, deps);
                return conf;
            });
    })
    .then(() => buildMisc(miscMap))
    .then(misc => conf.misc = misc)
    .then(() => checkConf(conf));
}

function buildState(conf, depConfs) {
    var objects = [];
    visitConfObjects(conf, o => objects.push(o));
    var state = {};
    depConfs.forEach(dep => _.assign(state, dep.state));
    state[conf.name] = objects;
    return state;
}

function buildMisc(miscMap) {
    var containers = Object.keys(miscMap || {}).map(k => JSON.parse(miscMap[k].toString()));
    return [].concat.apply([], containers.map(c => c.objects));
}

function buildDocs(conf, docsMap, depConfs) {
    let docs = Object.assign({},docsMap);
    depConfs.forEach(dep => docs = Object.assign(docs,dep.docs||{}));
    return docs;
}

function checkConf(conf, confName) {
    var invalidRegistrations = [];
    var duplicates = [];
    var unique = {};
    Object.keys(conf.state).map(s => conf.state[s]).forEach(oo => oo.forEach(o => {
        if (unique[o.id]) {
            duplicates.push({ id: o.id, name: _.get(o, 'registrations[0].validity[0].input.name'), message: 'Known in other conf: ' + conf.name });
        }
        unique[o.id] = { id: o.id, confName: conf.name };
        if (!_.has(o, 'registrations[0].validity[0].input')) {
            invalidRegistrations.push(o);
        }
    }));
    if (duplicates.length || invalidRegistrations.length) {
        return Promise.reject({
            duplicates: { [conf.name]: duplicates },
            invalidRegistrations: { [conf.name]: invalidRegistrations }
        });
    }
    return Promise.resolve(conf);
}

function buildData(conf, dataMap, depConfs) {
    var buffers = Object.keys(dataMap).map(k => dataMap[k]);
    depConfs.forEach(dep => buffers = buffers.concat(dep.data || []));
    return buffers;
}
