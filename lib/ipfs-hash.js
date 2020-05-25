"use strict";

//toPromise.Promise = require('bluebird');
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
    
module.exports = function (content) {
    let result;
    return ( async () => {
        for await ( const file of importer([ { path: 'path', content: Buffer.from(content) } ], ipld, { onlyHash: true })) {
            result = file;
        }
    })()
    .then(() => {
        return new CID(result.cid).toBaseEncodedString();
    });
}
