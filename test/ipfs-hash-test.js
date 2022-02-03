"use strict";

var chai = require('chai');
chai.use(require('chai-as-promised'));
var assert = chai.assert;
var IPFS = require('../lib/ipfs-hash');

const small = 'banana slug';
const smallHash = 'Qmcpsr5N2XwMtRWMsM7omHcFELtRETKTkdnvkB1CZqPmbw';
const large = Buffer.alloc(1024**2, 'x').toString();
const largeHash = 'QmZxqsmKZbwrPGAiPDgnUHKuh7FicKDFMpaE8B6mhdQAH3';

var node;
describe('ipfsHash', function() {
    before(function () {
      return IPFS.start().then(function (ipfs) {
        node = ipfs;
      });
    });
    
    after(function () {
      return node.stop();
    });
    
    it('should generate IPFS multihash of small data', function() {
      return node.hash(small).then(function (hash) {
        assert.equal(hash, smallHash);
      });
    }).timeout(3000);

    it('should generate IPFS multihash of small data', function() {
      return node.hash(large).then(function (hash) {
        assert.equal(hash, largeHash);
      });
    }).timeout(3000);
});
