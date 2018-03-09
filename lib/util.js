"use strict";

module.exports = {
    visitConfObjects: visitConfObjects,
    visitEachAttribute: visitEachAttribute
};

function visitConfObjects(conf, visitor) {
    Object.keys(conf.model || {}).forEach(function(name) {
        var model = conf.model[name];
        var classes = model.classes || {};
        var instances = model.instances || {};
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
