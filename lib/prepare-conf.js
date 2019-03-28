"use strict";

var Promise = require('bluebird');
var requireyml = require('require-yml');
var uuid = require('uuid');
var loadData = require('./load-data');
var resolveConf = require('./resolve-conf');
var visitConfObjects = require('./util').visitConfObjects;
var through2 = require('through2');
let Duplex = require('stream').Duplex;

module.exports = prepareConf;

function prepareConf(confLoc, dataLoc, confName, depConfs, miscLoc, docsLoc) {
    depConfs = depConfs || [];
    var conf = {
        name: confName || uuid.v4(),
        model: enrichModel(requireyml(confLoc)),
        resolve: function() {
            return loadData(dataLoc).then(dataMap => {
                return loadData(miscLoc).then(miscMap => {
                    return loadData(docsLoc).then(docsMap => {
                        return resolveConf(conf, dataMap, depConfs, miscMap, docsMap).then(result => {
                            // Make resolve() idempotent
                            result.resolve = function() { return Promise.resolve(result); };
                            return result;
                        });
                    });
                });
            });
        },
        upload: function(ipfs) {
          return conf.resolve().then((conf) => {
            //add all files to IPFS
            return Promise.map(conf.data, (fileBuffer) => {
              let stream = new Duplex();
              stream.push(fileBuffer);
              stream.push(null);

              return ipfs.files.add(stream.pipe(through2()));
            });
          });
        },
        deploy: function (args) {
          return conf.resolve().then((conf) => {
            return Promise.mapSeries(Object.keys(conf.state), (chain) => {
              var deployChain = chain;
              if (args.deployChain) {
                deployChain = args.deployChain;
              }
              return args.api.promise.core.add({objects: conf.state[chain], context: { domain: args.domain, chain: deployChain}})
              .tap(args.api.promise.index.waitfor)
              .tap(args.api.promise.winch.waitfor);
            });
          });
        }
    };
    return conf;
}

function enrichModel(model) {
    visitConfObjects({ model: model }, o => {
        o.snapshot = o.registrations[0].validity[0].input;
        o.name = o.snapshot.name || o.id;
        o.ref = { id: o.id, name: o.name };
    });
    return model;
}
