#!/usr/bin/env node

"use strict";

var inspect = require('util').inspect;
var fs = require('fs');
var path = require('path');
var through = require('through');
var cheerio = require('cheerio');
var Markdownpdf = require("markdown-pdf");
var buildDocuments = require(path.join(__dirname, '../lib/build-documents'));
var conf = require(process.env.PWD); // Loads index.js of outer npm project

var preProcessHtml = function(dst) {
    return function() {
        return through(function(data) {
            let $ = cheerio.load(data);

            $('img[src]').each(function(i, elem) {
                let src = $(this).attr('src');
                src = path.join(path.dirname(dst),src);
                $(this).attr('src', src);
            });

            fs.createWriteStream(dst).write($.html());
            this.queue($.html());
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

        // Build each markdown file to HTML and PDF. Only docs in docs/ root are used
        if (docs) Object.keys(docs).forEach(key => {
            let src = docs[key];
            let dst = src.replace(process.env.PWD,'').replace('node_modules','')
                         .replace('re-conf', 'conf').replace('docs', '');
            dst = path.join(process.env.PWD,'build','docs',dst);
            if (typeof src === 'string' && src.endsWith(".md")) {

                let dstPdf = dst.replace('.md', '.pdf');
                let dstHtml = dst.replace('.md', '.html');

                options.preProcessHtml = preProcessHtml(dstHtml);
                Markdownpdf(Object.assign({},options)).from(src).to(dstPdf, function () {
                  console.log("Done " + dst.replace(process.env.PWD,''));
                });
            } else {
                let dstDir = path.dirname(dst);
                if (!fs.existsSync(dstDir)) fs.mkdirSync(dstDir);
                fs.createReadStream(src).pipe(fs.createWriteStream(dst));
            }
        });
    })
    .catch(function(errors) {
        console.log('Operation failed:');
        console.log(inspect(errors, null, null));
    });
