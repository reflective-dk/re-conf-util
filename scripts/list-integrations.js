#!/usr/bin/env node

"use strict";

var _ = require('lodash');
var path = require('path');
var models = require('re-models').model;
var buildObjects = require(path.join(__dirname, '../lib/build-objects'));
var conf = require(process.env.PWD); // Loads index.js of outer npm project

buildObjects(conf).then(function(objects) {
    console.log('Integration Specs:');
    objects.filter(o => _.get(o, 'registrations[0].validity[0].input.class.id') ===
                   models.integration.classes['integration-spec'].id)
        .forEach(print);
    console.log('Extraction Specs:');
    objects.filter(o => _.get(o, 'registrations[0].validity[0].input.class.id') ===
                   models.integration.classes['extraction-spec'].id)
        .forEach(print);
});

function print(o) {
    var result = {};
    result[o.id] = o.registrations[0].validity[0].input.name;
    console.log(result);
}
