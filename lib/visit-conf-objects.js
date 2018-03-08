"use strict";

module.exports = visitConfObjects;

function visitConfObjects(conf, visitor) {
        Object.keys(conf).forEach(function(model) {
        var cnf = conf[model];
        var classes = cnf.classes || {};
        var instances = cnf.instances || {};
        Object.keys(classes).forEach(function(c) {
            visitor(classes[c]);
        });
        Object.keys(instances).forEach(function(c) {
            var collection = instances[c];
            Object.keys(collection).forEach(function(i) {
                visitor(collection[i]);
            });
        });
    });
}
