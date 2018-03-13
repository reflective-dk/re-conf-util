"use strict";

var Promise = require('bluebird');
var fs = require('mz/fs');
var path = require('path');

module.exports = loadData;

function loadData(loc) {
    loc = path.resolve(loc);
    // wrap to convert to bluebird
    return Promise.resolve(fs.readdir(loc)).then(names => {
        return Promise.map(names, name => fs.readFile(path.join(loc, name)))
            .then(buffers => {
                var data = {};
                names.forEach((name, index) => data[name] = buffers[index]);
                return data;
            });
    }).catch(function() { return {}; });
}
