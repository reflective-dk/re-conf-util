#!/usr/bin/env node

"use strict";

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var yaml = require('js-yaml');

var buildObjects = require(path.join(__dirname, '../lib/build-objects'));
var bpmnDoctor = require(path.join(__dirname, '../lib/bpmn-doctor'));

var bpmnLocation = path.join(process.env.PWD, 'data');
var reportLocation = path.join(process.env.PWD, 'bpmn-reports');
var conf = require(process.env.PWD); // Loads index.js of outer npm project

buildObjects(conf).then(function(objects) {
    var objectMap = _.keyBy(objects, 'id');
    var filenames = fs.readdirSync(bpmnLocation).filter(fn => /.bpmn$/.test(fn));
    if (!fs.existsSync(reportLocation)) {
        fs.mkdirSync(reportLocation);
    }
    filenames.forEach(function(filename) {
        var xml = fs.readFileSync(path.join(bpmnLocation, filename), 'utf8');
        bpmnDoctor(xml, objectMap, function(err, report) {
            if (err) {
                console.log(err);
                process.exit(1);
            }
            fs.writeFileSync(path.join(reportLocation, path.basename(filename, '.bpmn') + '.yaml'),
                             yaml.dump(report));
        });
    });
});
