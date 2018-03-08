"use strict";

var visitConfObjects = require('./visit-conf-objects');

module.exports = buildState;

function buildState(conf) {
    var objects = [];
    visitConfObjects(conf, o => objects.push(o));
    return objects;
}
