#!/usr/bin/env node

"use strict";

var requireyml = require('require-yml');
var path = require('path');

var thatLoc = process.argv[2];

if (!thatLoc) {
    console.error('usage: compare-to <path/to/other/conf>');
    process.exit(1);
}

var thisConf = requireyml(path.join(process.env.PWD, 'conf'));
var thatConf = requireyml(path.join(thatLoc, 'conf'));

var uuidMap = {};

visitAll(thisConf, uuidMap);
visitAll(thatConf, uuidMap);

var duplicates = {};

Object.keys(uuidMap)
    .filter(k => uuidMap[k].length > 1)
    .forEach(k => duplicates[k] = uuidMap[k]);

if (Object.keys(duplicates).length) {
    console.log('reused uuids found:');
    console.log(duplicates);
} else {
    console.log('no reused uuids found:');
}

function visitAll(conf, map, path) {
    path = path || [];
    switch (true) {
    case !conf:
    case Array.isArray(conf):
    case typeof conf != 'object':
        return map;
    case !!conf.id && !! conf.registrations:
        var list = map[conf.id] = map[conf.id] || [];
        list.push(path.join('.'));
        return map;
    default:
        Object.keys(conf).forEach(k => visitAll(conf[k], map, path.concat([ k ])));
        return map;
    }
}
