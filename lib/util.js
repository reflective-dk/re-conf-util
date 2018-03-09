"use strict";

module.exports = {
    visitConfObjects: visitConfObjects,
    visitEachAttribute: visitEachAttribute
};

function visitConfObjects(models, visitor) {
    Object.keys(models || {}).forEach(function(model) {
        var cnf = models[model];
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

function visitEachAttribute(object, visitor) {
    ((object || {}).registrations || [])
        .forEach(r => (r.validity || [])
                 .forEach(v => Object.keys(v.input || {})
                          .forEach(k => visitor(v.input[k]))));
}
