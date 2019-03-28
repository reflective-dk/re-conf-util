"use strict";

module.exports = buildDocuments;

function buildDocuments(conf) {
    return conf.resolve().then(cnf => {
        return [].concat.apply(cnf.docs);
    });
}
