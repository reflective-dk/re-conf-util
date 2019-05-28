"use strict";

var chai = require('chai');
chai.use(require('chai-as-promised'));
var expect = chai.expect;
var path = require('path');
var requireyml = require('require-yml');

var rootLoc = path.join(path.dirname(require.resolve('../index')), 'test-data');
var confLoc = path.join(rootLoc, 'conf');
var dataLoc = path.join(rootLoc, 'widgets');

var confUtil = require('../index');

describe('End-to-end test', function() {
    before(setUp);
    it('should prepare test configuration', function(done) {
        var conf = confUtil.prepareConf(confLoc, dataLoc, 'test-conf');
        expect(conf.resolve().tap(resolved => {
            delete resolved.resolve;
            delete resolved.upload;
            delete resolved.deploy;
        })).to.eventually.deep.equal(this.resolved)
           .notify(done);
    });

    it('should build array of objects', function(done) {
        var conf = confUtil.prepareConf(confLoc, dataLoc, 'test-conf');
        expect(confUtil.buildObjects(conf))
            .to.eventually.deep.equal(this.objects)
            .notify(done);
    });
});

function setUp() {
    var acmeClass = requireyml(path.join(confLoc, 'test', 'classes', 'acme'));
    acmeClass.snapshot = acmeClass.registrations[0].validity[0].input;
    acmeClass.name = acmeClass.snapshot.name;
    acmeClass.ref = { id: acmeClass.id, name: acmeClass.name };
    var acme1 = requireyml(path.join(confLoc, 'test', 'instances', 'acme', 'acme-1'));
    acme1.snapshot = acme1.registrations[0].validity[0].input;
    acme1.name = acme1.snapshot.name;
    acme1.ref = { id: acme1.id, name: acme1.name };
    acme1.snapshot.widget.hash = 'QmXpKLc4Lmki1ey7c91KeNHvXVKVHxbezHqEBWn5gmwu35';
    acme1.snapshot.widget.key = "widget-1.txt";
    var acme2 = requireyml(path.join(confLoc, 'test', 'instances', 'acme', 'acme-2'));
    acme2.snapshot = acme2.registrations[0].validity[0].input;
    acme2.name = acme2.snapshot.name;
    acme2.ref = { id: acme2.id, name: acme2.name };
    acme2.snapshot.widget.hash = 'QmQZJY6gh1aWFMyhWocGix7fMMDv94pmCVd3p8d59XHW4b';
    acme2.snapshot.widget.key = "widget-2.txt";
    this.resolved = {
        name: 'test-conf',
        model: { test: {
            classes: { acme: acmeClass },
            instances: { acme: { 'acme-1': acme1, 'acme-2': acme2 } }
        } },
        state: { 'test-conf': [ acmeClass, acme1, acme2 ] },
        docs: {},
        misc: [],
        data: [
            Buffer.from('This is Widget 1\n'),
            Buffer.from('This is Widget 2\n')
        ]
    };
    this.objects = [ acmeClass, acme1, acme2 ];
}
