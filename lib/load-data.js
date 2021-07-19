"use strict";

var Promise = require('bluebird');
var fs = require('mz/fs');
var path = require('path');

module.exports = loadData;

function loadData(loc) {
    if (!loc) {
        return Promise.resolve({});
    }
    loc = path.resolve(loc);

    // Ændret til sync, pga. recursion.
    function _loadData(loc, confName) {
        let data = {};
        if (!fs.existsSync(loc)) {
            return {};
        }
        let fileNames = fs.readdirSync(loc);
        if (fileNames) {
            fileNames.forEach(function(name) {
                let fileName = path.join(loc, name);
                if (!fs.existsSync(fileName)) {
                    console.error('Could not find file for conf: "' + confName +'"');
                }
                if (fs.lstatSync(fileName).isDirectory()) {
                    data[name] = _loadData(fileName);
                } else {
                    data[name] = fs.readFileSync(fileName);
                }
            });
        }
        return data;
    }

    return Promise.resolve(_loadData(loc));
}
