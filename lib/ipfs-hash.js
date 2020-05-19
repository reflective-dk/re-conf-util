"use strict";

const pull = require('pull-stream');
const toPromise = require('pull-to-promise');
toPromise.Promise = require('bluebird');
const importer = require('ipfs-unixfs-importer');
const ipld = new (require('ipld'))({
    blockService: {
        //faked blockservice
      get: function (cid, options) {
          return new Promise.resolve();
      }
    }
});
const CID = require('cids');

module.exports = ipfsHash;

function ipfsHash(content) {
    return pull(
        pull.values([ { path: 'path', content: Buffer.from(content) } ]),
        importer(ipld, { onlyHash: true }),
        toPromise.any
    ).then(res => new CID(res[0].multihash).toBaseEncodedString());
}
