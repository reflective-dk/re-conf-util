"use strict";

var path = require('path');

module.exports = buildDocuments;

function buildDocuments(conf) {
    return conf.resolve().then(cnf => {
        return [].concat.apply(
            Object.keys(cnf.docs).map(name => {
              return path.join(conf.name, 'docs', name);
            })
        );
    });
}
