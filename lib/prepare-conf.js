"use strict";

var requireyml = require('require-yml');
var _ = require('lodash');
var uuid = require('uuid');
var loadData = require('./load-data');
var resolveConf = require('./resolve-conf');

module.exports = prepareConf;

function prepareConf(confLoc, dataLoc, confName, depConfs) {
    depConfs = depConfs || [];
    var conf = {
        name: confName || uuid.v4(),
        model: requireyml(confLoc),
        resolve: function() {
            return loadData(dataLoc).then(dataMap => {
                return resolveConf(conf, dataMap, depConfs);
            });
        }
    };
    return conf;
}
