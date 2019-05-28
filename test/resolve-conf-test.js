"use strict";

var Promise = require('bluebird');
var chai = require('chai');
chai.use(require('chai-as-promised'));
var expect = chai.expect;
var resolveConf = require('../lib/resolve-conf');

describe('resolveConf', function() {
    before(setUp);
    it('should resolve conf with empty dependency array', function() {
        return expect(resolveConf(this.baseConf, this.dataMap, []))
            .to.eventually.deep.equal(this.confNoDeps,
            'no dependencies specified so none should not be included');
    });

    it('should resolve conf with no dependencies specified', function() {
        return expect(resolveConf(this.baseConf, this.dataMap))
            .to.eventually.deep.equal(this.confNoDeps,
            'no dependencies specified so none should not be included');
    });

    it('should resolve conf with a set of dependencies', function() {
        return expect(resolveConf(this.baseConf, this.dataMap, [ this.depConf ]))
            .to.eventually.deep.equal(this.confWithDeps,
            'one dependency should be pulled in');
    });
});

function setUp() {
    var self = this;
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
        model: {
            boring: {
                classes: { 'boring-class': { id: 'boring-class' } },
                instances: { 'boring-class': { 'boring-instance': { id: 'boring-instance' } } }
            }
        },
        resolve: function() { return Promise.resolve(self.depConf); },
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
        docs: {},
        misc: [],
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
        docs: {},
        misc: [],
        state: {
            'conf-acme': [ { id: 'acme-class' }, { id: 'acme-instance' } ],
            'conf-boring': [ { id: 'boring-class' }, { id: 'boring-instance' } ]
        },
        data: []
    };
}
