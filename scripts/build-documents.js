#!/usr/bin/env node

"use strict";

var inspect = require('util').inspect;
var fs = require('fs');
var path = require('path');
var Remarkable = require("remarkable");
var Markdownpdf = require("markdown-pdf");
var buildDocuments = require(path.join(__dirname, '../lib/build-documents'));
var conf = require(process.env.PWD); // Loads index.js of outer npm project

buildDocuments(conf)
    .then(function(docs) {
//console.log("DEBUG: buildDocuments docs=", docs);
        let options = {
            remarkable: {
                preset: true,
                html: true,
                linkify: true,
                typographer: true,
            }
        };

        let mdHtml = new Remarkable(options.remarkable);
        let mdPdf = new Markdownpdf(options);

        // Build each markdown file to HTML and PDF. Only docs in docs/ root are used
        if (docs) docs.forEach(doc => {
            if (doc) Object.keys(doc).forEach(key => {
console.log(key);

            });
        });


        // Create project index page


//        var output = JSON.stringify({ objects: objects }, null, 2);
//        try { fs.mkdirSync('build'); } catch(e) {}
//        fs.writeFileSync(path.join(process.env.PWD, 'build/objects.json'), output);
    })
    .catch(function(errors) {
        console.log('Operation failed:');
        console.log(inspect(errors, null, null));
    });

function getDocument(path) {

}