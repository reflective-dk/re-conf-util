"use strict";

var Promise = require('bluebird');
var _ = require('lodash');
var visitConfObjects = require('./util').visitConfObjects;
var remapHashes = require('./remap-hashes');
var idgen = require('../lib/idgen');

var classClassRef = { id: '12b4049a-fb65-4429-a9d7-c91d88a58ac9', name: 'Class' };
var classViewClassRef = { id: 'd40801f9-83a9-4a7c-bad7-993fa26d5ded', name: 'Class View' };

module.exports = resolveConf;

function resolveConf(conf, dataMap, depConfs, miscMap) {
    return Promise.map(depConfs || [], dc => dc.resolve())
    .then(function(deps) {
        return remapHashes(conf, dataMap)
            .then(function() {
                return Promise.all([
                    buildState(conf, deps), buildData(conf, dataMap, deps),
                    buildMisc(miscMap), buildClassViews(conf, deps)
                ]);
            });
    })
    .spread(function(state, data, misc, classViews) {
        conf.state = state;
        conf.data = data;
        conf.misc = misc;
        conf.classViews = classViews;
        return checkConf(conf);
    });
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

function checkConf(conf, confName) {
    var duplicates = [];
    var unique = {};
    Object.keys(conf.state).map(s => conf.state[s]).forEach(oo => oo.forEach(o => {
        if (unique[o.id]) {
            duplicates.push({ id: o.id, name: o.registrations[0].validity[0].input.name });
        }
        unique[o.id] = true;
    }));
    var namedDup = {};
    namedDup[conf.name] = duplicates;
    return duplicates.length ?
        Promise.reject({ duplicates: namedDup }) : Promise.resolve(conf);
}

function buildData(conf, dataMap, depConfs) {
    var buffers = Object.keys(dataMap).map(k => dataMap[k]);
    depConfs.forEach(dep => buffers = buffers.concat(dep.data || []));
    return buffers;
}

function buildClassViews(conf, depConfs) {
    var views = [];
    visitConfObjects(conf, o => {
        var view = buildClassView(o);
        view && views.push(view);
    });
    var classViews = {};
    depConfs.forEach(dep => _.assign(classViews, dep.classViews));
    classViews[conf.name] = views;
    return classViews;
}

function buildClassView(candidate) {
    if ((((candidate || {}).snapshot || {}).class || {}).id !== classClassRef.id) {
        return null;
    }
    var view = {
        id: idgen(candidate.id, classViewClassRef.id, classViewClassRef.id),
        snapshot: {
            class: classViewClassRef,
            name: candidate.snapshot.name,
            source: { id: candidate.id, name: candidate.snapshot.name }
        }
    };
    if (candidate.snapshot.extends) {
        view.snapshot.extends = asClassViewRef(candidate.snapshot.extends);
    }
    if (candidate.snapshot.mixins) {
        view.snapshot.mixins = asClassViewRefs(candidate.snapshot.mixins);
    }
    var props = candidate.snapshot.properties || {};
    var attributes = {};
    var single = {};
    var multi = {};
    Object.keys(props).forEach(k => {
        var prop = props[k];
        if (prop.dataType.type !== 'relation') {
            var dataType = typeof prop.dataType === 'string' ? prop.dataType : prop.dataType.type;
            attributes[k] = dataType + (prop.type === 'simple' ? '' : '[]');
        } else {
            var collection = (prop.type === 'simple') ? single : multi;
            collection[k] = prop.dataType.target;
        }
    });
    if (Object.keys(attributes).length) {
        view.snapshot.attributes = attributes;
    }
    if (Object.keys(single).length) {
        view.snapshot.single = asClassViewRefs(single);
    }
    if (Object.keys(multi).length) {
        view.snapshot.multi = asClassViewRefs(multi);
    }
    view.registrations = [ {
        validity: [ {
            input: view.snapshot,
            from: candidate.registrations[0].validity[0].from
        } ]
    } ];
    return view;
}

function asClassViewRefs(classRefs) {
    var viewRefs = {};
    Object.keys(classRefs).forEach(k => {
        viewRefs[k] = asClassViewRef(classRefs[k]);
    });
    return viewRefs;
}

function asClassViewRef(classRef) {
    return {
        id: idgen(classRef.id, classViewClassRef.id, classViewClassRef.id),
        name: classRef.name
    };
}
