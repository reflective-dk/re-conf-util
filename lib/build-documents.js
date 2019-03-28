"use strict";

module.exports = buildDocuments;

function buildDocuments(conf) {
    return conf.resolve().then(cnf => {
console.log("DEBUG: buildDocuments, cnf=",cnf);
        return [].concat.apply(cnf.misc, Object.keys(cnf.state).map(s => cnf.state[s]));
    });
}
