"use strict";

var requireyml = require('require-yml');
var uuid = require('uuid');
var loadData = require('./load-data');
var resolveConf = require('./resolve-conf');
var visitConfObjects = require('./util').visitConfObjects;

module.exports = prepareConf;

function prepareConf(confLoc, dataLoc, confName, depConfs) {
    depConfs = depConfs || [];
    var conf = {
        name: confName || uuid.v4(),
        model: enrichModel(requireyml(confLoc)),
        resolve: function() {
            return loadData(dataLoc).then(dataMap => {
                return resolveConf(conf, dataMap, depConfs).then(result => {
                    delete result.resolve; // resolve removes itself on the way out
                    return result;
                });
            });
        }
    };
    return conf;
}

function enrichModel(model) {
    visitConfObjects({ model: model }, o => {
        o.snapshot = o.registrations[0].validity[0].input;
        o.name = o.snapshot.name || o.id;
        o.ref = { id: o.id, name: o.name };
    });
    return model;
}
