"use strict";

module.exports = buildState;

function buildState(conf) {
    var objects = [];
    Object.keys(conf).forEach(function(model) {
        var cnf = conf[model];
        var classes = cnf.classes || {};
        var instances = cnf.instances || {};
        Object.keys(classes).forEach(function(c) {
            objects.push(classes[c]);
        });
        Object.keys(instances).forEach(function(c) {
            var collection = instances[c];
            Object.keys(collection).forEach(function(i) {
                objects.push(collection[i]);
            });
        });
    });
    return objects;
}
