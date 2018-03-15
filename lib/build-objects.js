"use strict";

module.exports = buildObjects;

function buildObjects(conf) {
    return conf.resolve().then(cnf => {
        return [].concat.apply([], Object.keys(cnf.state).map(s => cnf.state[s]));
    });
}
