#!/usr/bin/env node

"use strict";

var inspect = require('util').inspect;
var fs = require('fs');
var path = require('path');
var through = require('through');
var Markdownpdf = require("markdown-pdf");
var buildDocuments = require(path.join(__dirname, '../lib/build-documents'));
var conf = require(process.env.PWD); // Loads index.js of outer npm project

var preProcessHtml = function() {

    return through(function(data) {
    });
};

buildDocuments(conf)
    .then(function(docs) {
        let options = {
            remarkable: {
                preset: 'full',
                html: true,
                linkify: true,
                typographer: true,
            }
        };
        let dstDir = path.join(process.env.PWD, 'build', 'docs')

//        let mdHtml = new Remarkable(options.remarkable);

        if (!fs.existsSync(dstDir)) {
            fs.mkdirSync(dstDir, {recursive: true});
        }

        // Build each markdown file to HTML and PDF. Only docs in docs/ root are used
        if (docs) docs.forEach(doc => {
            let src;
            if (doc.startsWith(conf.name)) {
                src = doc.replace(conf.name + path.sep, '');
            } else {
                doc = "re-" + doc;
                src = path.join('node_modules',doc);
            }

            src = path.join(process.env.PWD, src);

            let mdPdf = Markdownpdf(options);
console.log("DEBUG: src=",src);
console.log("DEBUG: option.pwd=",options.pwd);

            // XXX: Move other doc types
            if (doc.endsWith(".md")) {
                doc = doc.replace('docs'+path.sep, '');

                let dstPdf = path.join(dstDir, doc.replace('.md', '.pdf'));
                let dstHtml = path.join(dstDir, doc.replace('.md', '.html'));

                // replace image path to absolute
//                const absolutePath = 'file:///' + process.cwd().replace(/ /g, '%20').replace(/\\/g, '/') + '/';
//                const find = /img src="/g;
//                const replace = 'img src="' + absolutePath;
//                const mdStr = mdSourceStr.replace(find, replace);

//console.log("DEBUG: preProcessHtml=",options.preProcessHtml);
//options.preProcessHtml().pipe(process.stdout);
//                options.preProcessHtml = function () { return through() };
                mdPdf.from(src).to(dstPdf, function () {
                  console.log(doc+" Done")
                })


//                    fs.createReadStream(src)
//                    .pipe(mdPdf)
//                    .pipe(fs.createWriteStream(dst))

//.pipe(fs.createWriteStream('out.txt'))
            }

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
