"use strict";

var chai = require('chai');
var expect = chai.expect;
var decorateObject = require('../lib/enrich-with-data').decorateObject;

describe('enrichWithData', function() {
    describe('decorateObject', function() {
        before(setUp);
        it('should decorate single reference attribute of one object', function() {
            expect(decorateObject(this.single, this.keys, this.hashes))
                .to.deep.equal(this.decoratedSingle);
        });

        it('should decorate multi reference attribute of one object', function() {
            expect(decorateObject(this.multi, this.keys, this.hashes))
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
