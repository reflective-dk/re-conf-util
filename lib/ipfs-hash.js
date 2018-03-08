"use strict";
const pull = require('pull-stream');
const toPromise = require('pull-to-promise');
toPromise.Promise = require('bluebird');
const importer = require('ipfs-unixfs-engine').importer;
const ipld = new (require('ipld'))({});
const CID = require('cids');

module.exports = ipfsHash;

function ipfsHash(content) {
    return pull(
        pull.values([ {
            path: 'path',
            content: Buffer.from(content.toString())
        } ]),
        importer(ipld, { onlyHash: true }),
        toPromise.any
    ).then(res => new CID(res[0].multihash).toBaseEncodedString());
}
