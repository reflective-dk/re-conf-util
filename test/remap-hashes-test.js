"use strict";

var chai = require('chai');
var expect = chai.expect;
var remapObject = require('../lib/remap-hashes').remapObject;

describe('remapHashes', function() {
    describe('remapObject', function() {
        before(setUp);
        it('should remap single reference attribute of one object', function() {
            expect(remapObject(this.single, this.keys, this.hashes))
                .to.deep.equal(this.decoratedSingle);
        });

        it('should remap multi reference attribute of one object', function() {
            expect(remapObject(this.multi, this.keys, this.hashes))
                .to.deep.equal(this.decoratedMulti);
        });
    });
});

function setUp() {
    this.keys = [ 'found-key', 'found-another-key' ];
    this.hashes = [ 'replaced-hash', 'replaced-another-hash' ];

    this.single = {
        id: 'single',
        registrations: [ { validity: [ { input: {
            normal: 42,
            relation: { id: 'other' },
            noMatch: { hash: 'not-found' },
            match: { hash: 'found-key' }
        } } ] } ]
    };

    this.decoratedSingle = {
        id: 'single',
        registrations: [ { validity: [ { input: {
            normal: 42,
            relation: { id: 'other' },
            noMatch: { hash: 'not-found' },
            match: { hash: 'replaced-hash' }
        } } ] } ]
    };

    this.multi = {
        id: 'multi',
        registrations: [ { validity: [ { input: {
            normal: 42,
            relation: { id: 'other' },
            noMatch: { hash: 'not-found' },
            multi: {
                noMatch: { hash: 'no-luck' },
                match: { hash: 'found-another-key' }
            }
        } } ] } ]
    };

    this.decoratedMulti = {
        id: 'multi',
        registrations: [ { validity: [ { input: {
            normal: 42,
            relation: { id: 'other' },
            noMatch: { hash: 'not-found' },
            multi: {
                noMatch: { hash: 'no-luck' },
                match: { hash: 'replaced-another-hash' }
            }
        } } ] } ]
    };
}
