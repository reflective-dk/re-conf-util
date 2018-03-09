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
        expect(conf.resolve())
            .to.eventually.deep.equal(this.resolved)
            .notify(done);
    });
});

function setUp() {
    var acmeClass = requireyml(path.join(confLoc, 'test', 'classes', 'acme'));
    var acme1 = requireyml(path.join(confLoc, 'test', 'instances', 'acme', 'acme-1'));
    var acme2 = requireyml(path.join(confLoc, 'test', 'instances', 'acme', 'acme-2'));
    acme1.registrations[0].validity[0].input.widget.hash =
        'QmXpKLc4Lmki1ey7c91KeNHvXVKVHxbezHqEBWn5gmwu35';
    acme2.registrations[0].validity[0].input.widget.hash =
        'QmQZJY6gh1aWFMyhWocGix7fMMDv94pmCVd3p8d59XHW4b';
    this.resolved = {
        name: 'test-conf',
        model: { test: {
            classes: { acme: acmeClass },
            instances: { acme: { 'acme-1': acme1, 'acme-2': acme2 } }
        } },
        state: { 'test-conf': [ acmeClass, acme1, acme2 ] },
        data: [
            Buffer.from('This is Widget 1\n'),
            Buffer.from('This is Widget 2\n')
        ]
    };
}
