#!/usr/bin/env node

"use strict";

var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var buildObjects = require(path.join(__dirname, '../lib/build-objects'));
var bpmnDoctor = require(path.join(__dirname, '../lib/bpmn-doctor'));

var bpmnLocation = path.join(process.env.PWD, 'data');
var conf = require(process.env.PWD); // Loads index.js of outer npm project

buildObjects(conf).then(function(objects) {
    var objectMap = _.keyBy(objects, 'id');
    var filenames = fs.readdirSync(bpmnLocation).filter(fn => /.bpmn$/.test(fn));
    var failure = false;
    filenames.forEach(function(filename, inx) {
        var xml = fs.readFileSync(path.join(bpmnLocation, filename), 'utf8');
        bpmnDoctor(xml, objectMap, function(err, report) {
            if (err) {
                console.log('ERROR', err);
                failure = true;
                return;
            }
            var invalidElements = _.get(report, 'invalidElements', []);
            var invalidFlowNodeRefs = _.get(report, 'flowNodeRefs.invalidReferences', []);
            if (invalidElements.length) {
                console.log('FAILURE', 'invalid elements:', report.name,
                            '(' + filename + ')', invalidElements);
                failure = true;
            }
            if (invalidFlowNodeRefs.length) {
                console.log('FAILURE', 'invalid flow node refs:', report.name,
                            '(' + filename + ')', invalidFlowNodeRefs);
                failure = true;
            }
            if (failure && (inx == filenames.length-1)) {
                process.exit(1);
            }
        });
    });
});
