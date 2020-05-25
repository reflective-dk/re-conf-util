"use strict";

var chai = require('chai');
chai.use(require('chai-as-promised'));
var expect = chai.expect;
var ipfsHash = require('../lib/ipfs-hash');

describe('ipfsHash', function() {
    before(setUp);
    
    it('should generate IPFS multihash of small data', function(done) {
        expect(ipfsHash(this.small)).to.eventually.equal(this.smallHash).notify(done);
    });

    it('should generate IPFS multihash of large data', function(done) {
        expect(ipfsHash(this.large)).to.eventually.equal(this.largeHash).notify(done);
    });
});

function setUp() {
    this.small = 'banana slug';
    this.smallHash = 'Qmcpsr5N2XwMtRWMsM7omHcFELtRETKTkdnvkB1CZqPmbw';
    this.large = Buffer.alloc(1024**2, 'x').toString();
    this.largeHash = 'QmZxqsmKZbwrPGAiPDgnUHKuh7FicKDFMpaE8B6mhdQAH3';
}
