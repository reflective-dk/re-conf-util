#!/usr/bin/env node

"use strict";

var streamify = require('stream-array');
var uuid = require('uuid');
var fs = require('fs');
var models = require('re-models').model;

var typeKey = process.argv[2];
var name = process.argv[3];

if (!typeKey || !name) {
    console.error('usage: random <type> <name>');
    process.exit(1);
}

var type = findType(typeKey);

if (!type) {
    console.error('type not found: ' + typeKey);
    process.exit(1);
}

streamify([ "\
---\n\
id: " + uuid.v4() +"\n\
mimeType: application/vnd.reflective-dk.object+json\n\
registrations:\n\
  - validity:\n\
      - input:\n\
          class: { id: " + type.id + ", name: " + type.name + " }\n\
          name: " + name + "\n\
...\n\
" ]).pipe(process.stdout);

function findType(tk) {
    var t;
    Object.keys(models).forEach(function(mk) {
        t = t || (models[mk].classes || {})[tk];
    });
    return t;
}
