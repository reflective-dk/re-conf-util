"use strict";

module.exports = visitEachAttribute;

function visitEachAttribute(object, visitor) {
    object.registrations
        .forEach(r => r.validity
                 .forEach(v => Object.keys(v.input)
                          .forEach(k => visitor(v.input[k]))));
}
