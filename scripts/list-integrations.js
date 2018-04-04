#!/usr/bin/env node

"use strict";

var confUtil = require('re-conf-util');
var models = require('re-models').model;
var conf = require('../index');

confUtil.buildObjects(conf).then(function(objects) {
    console.log('Integration Specs:');
    objects.filter(o => o.registrations[0].validity[0].input.class.id ===
                   models.integration.classes['integration-spec'].id)
        .forEach(print);
    console.log('Extraction Specs:');
    objects.filter(o => o.registrations[0].validity[0].input.class.id ===
                   models.integration.classes['extraction-spec'].id)
        .forEach(print);
});

function print(o) {
    var result = {};
    result[o.id] = o.registrations[0].validity[0].input.name;
    console.log(result);
}
