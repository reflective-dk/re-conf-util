"use strict";

var Promise = require('bluebird');
var _ = require('lodash');
var requireyml = require('./require-yml');
var uuid = require('uuid');
var loadData = require('./load-data');
var loadDocs = require('./load-docs');
var resolveConf = require('./resolve-conf');
var visitConfObjects = require('./util').visitConfObjects;
var through2 = require('through2');
let Duplex = require('stream').Duplex;

module.exports = prepareConf;

function prepareConf(confLoc, dataLoc, confName, depConfs, miscLoc, docsLoc, options) {
    depConfs = depConfs || [];
    var conf = {
        name: confName || uuid.v4(),
        model: enrichModel(requireyml(confLoc)),
        resolve: function() {
            return loadData(dataLoc, confName).then(dataMap => {
                return loadData(miscLoc, confName).then(miscMap => {
                    return loadDocs(docsLoc).then(docsMap => {
                        return resolveConf(conf, dataMap, depConfs, miscMap, docsMap, options).then(result => {
                            // Make resolve() idempotent
                            result.resolve = function() { return Promise.resolve(result); };
                            return result;
                        });
                    });
                });
            });
        },
        upload: function(api) {
          return conf.resolve().then((conf) => {
            //add all files to IPFS
            return Promise.map(conf.data, (fileBuffer) => {
              let stream = new Duplex();
              stream.push(fileBuffer);
              stream.push(null);

              return api.promise.core.fileAdd({ stream: stream.pipe(through2()) });
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
              let context = { domain: args.domain, chain: deployChain };
              if (args.extension) {
                context.extension = args.extension;
              }
              return args.api.promise.core.add({objects: conf.state[chain], context: context })
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
        if (typeof o === 'object') {
            o.snapshot = _.get(o, 'registrations[0].validity[0].input', {});
            o.name = o.snapshot.name || o.id;
            o.ref = { id: o.id, name: o.name };
        }
    });
    return model;
}
