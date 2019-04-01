#!/usr/bin/env node

"use strict";

var inspect = require('util').inspect;
var fs = require('fs');
var path = require('path');
var through = require('through');
var Markdownpdf = require("markdown-pdf");
var buildDocuments = require(path.join(__dirname, '../lib/build-documents'));
var conf = require(process.env.PWD); // Loads index.js of outer npm project

var preProcessHtml = function(src,dst) {
    return function() {
        return through(function(data) {
            let strData = data.toString();

console.log("DEBUG: src=",src);
console.log("DEBUG: dst=",dst);
//console.log("DEBUG: data=",data);

            // replace image path to absolute
            const absolutePath = 'file:///' + path.dirname(src).replace(/ /g, '%20') + '/';
            const find = /img src="/g;
            const replace = 'img src="' + absolutePath;
            strData = strData.replace(find, replace);

            fs.createWriteStream(dst).write(strData);
        });
    };
};

buildDocuments(conf)
    .then(function(docs) {
        let options = {
            remarkable: {
                preset: 'full',
                html: true,
                linkify: true,
                typographer: true,
            },
        };
        let dstDir = path.join(process.env.PWD, 'build', 'docs');

        // Build each markdown file to HTML and PDF. Only docs in docs/ root are used
        if (docs) docs.forEach(doc => {
            let src;
            if (doc.startsWith(conf.name)) {
                src = doc.replace(conf.name + path.sep, '');
            } else {
                doc = "re-" + doc;
                src = path.join('node_modules',doc);
            }

            // Absolute src path
            src = path.join(process.env.PWD, src);

            // XXX: Move other doc types
            if (doc.endsWith(".md")) {
                doc = doc.replace('docs'+path.sep, '');

                let dstPdf = path.join(dstDir, doc.replace('.md', '.pdf'));
                let dstHtml = path.join(dstDir, doc.replace('.md', '.html'));

                if (!fs.existsSync(dstDir)) {
                    fs.mkdirSync(dstDir, {recursive: true});
                }
                options.preProcessHtml = preProcessHtml(src,dstHtml);


//                fs.createReadStream(src)
//                      .pipe(Markdownpdf(Object.assign({},options)))
//                      .pipe(fs.createWriteStream(dstPdf))

                Markdownpdf(Object.assign({},options)).from(src).to(dstPdf, function () {
                  console.log(doc+" Done");
                });
            }
        });
    })
    .catch(function(errors) {
        console.log('Operation failed:');
        console.log(inspect(errors, null, null));
    });
