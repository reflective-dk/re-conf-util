"use strict";

Promise = require('bluebird');
var fs = require('mz/fs');
var path = require('path');
var format = require('string-template');

var formGenerator = {
  readFiles: function (loc, extension) {
    return fs.readdir(loc)
    .then(names => names.filter(name => path.extname(name) === extension))
    .then(function(names) {
      var snippets = {};
      return Promise.each(names, function(name) {
        return fs.readFile(path.join(loc, name), 'utf-8')
        .then(contents => snippets[name] = contents);
      }).then(() => snippets);
    });
  },
  writeFiles: function (loc, contentMap) {
    return Promise.each(Object.keys(contentMap), function(name) {
      return fs.writeFile(path.join(loc, name), contentMap[name]);
    });
  },
  generateForms: function (formLocation, dataLocation) {
    return Promise.all([formGenerator.readFiles(formLocation, '.js'), formGenerator.readFiles(formLocation, '.webix')])
    .then((results) =>  {
      var forms = results[0], snippets = results[1];
      return formGenerator.formatForms(forms, snippets);
    })
    .then(formatted => formGenerator.writeFiles(dataLocation, formatted));
  },
  formatForms: function (forms, snippets) {
    var formatted = {};
    Object.keys(forms).forEach(k => formatted[k] = format(forms[k], snippets));
    return Promise.resolve(formatted);
  }
};

module.exports = formGenerator;