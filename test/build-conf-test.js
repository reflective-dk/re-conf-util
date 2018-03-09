"use strict";

var chai = require('chai');
var expect = chai.expect;
var buildConf = require('../lib/build-conf');

describe('buildConf', function() {
    before(setUp);
    it('should build conf with no dependencies', function() {
        expect(buildConf(this.baseConf, this.dataMap, []))
            .to.deep.equal(this.confNoDeps, 'no dependencies specified so none should not be included');
    });

    it('should build conf with a set of dependencies', function() {
        expect(buildConf(this.baseConf, this.dataMap, [ this.depConf ]))
            .to.deep.equal(this.confWithDeps, 'one dependency should be pulled in');
    });
});

function setUp() {
    this.baseConf = {
        name: 'conf-acme',
        model: {
            acme: {
                classes: { 'acme-class': { id: 'acme-class' } },
                instances: { 'acme-class': { 'acme-instance': { id: 'acme-instance' } } }
            }
        }
    };

    // Dependency configurations have already been resolved as they're pulled in
    // Therefore this dependency already has state and data
    this.depConf = {
        name: 'conf-boring',
        mode: {
            boring: {
                classes: { 'boring-class': { id: 'boring-class' } },
                instances: { 'boring-class': { 'boring-instance': { id: 'boring-instance' } } }
            }
        },
        state: {
            'conf-boring': [ { id: 'boring-class' }, { id: 'boring-instance' } ]
        },
        data: []
    };

    this.dataMap = {};

    this.confNoDeps = {
        name: 'conf-acme',
        model: {
            acme: {
                classes: { 'acme-class': { id: 'acme-class' } },
                instances: { 'acme-class': { 'acme-instance': { id: 'acme-instance' } } }
            }
        },
        state: {
            'conf-acme': [ { id: 'acme-class' }, { id: 'acme-instance' } ]
        },
        data: []
    };

    this.confWithDeps = {
        name: 'conf-acme',
        model: {
            acme: {
                classes: { 'acme-class': { id: 'acme-class' } },
                instances: { 'acme-class': { 'acme-instance': { id: 'acme-instance' } } }
            }
        },
        state: {
            'conf-acme': [ { id: 'acme-class' }, { id: 'acme-instance' } ],
            'conf-boring': [ { id: 'boring-class' }, { id: 'boring-instance' } ]
        },
        data: []
    };
}
