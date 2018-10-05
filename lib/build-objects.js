"use strict";

module.exports = buildObjects;

function buildObjects(conf) {
    return conf.resolve().then(cnf => {
        return [].concat(
            cnf.misc,
            [].concat.apply([], Object.keys(cnf.state).map(k => cnf.state[k])),
            [].concat.apply([], Object.keys(cnf.classViews).map(k => cnf.classViews[k]))
        );
    });
}
