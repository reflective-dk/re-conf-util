"use strict";

var requireyml = require('require-yml');
var _ = require('lodash');
var uuid = require('uuid');
var loadData = require('./load-data');
var buildConf = require('./build-conf');

module.exports = prepareConf;

function prepareConf(confLoc, dataLoc, confName, depConfs) {
    depConfs = depConfs || [];
    confName = confName || uuid.v4();
    var conf = requireyml(confLoc);
    conf.name = confName;
    var dataMap = loadData(dataLoc);
    return buildConf(conf, dataMap, depConfs);
}
