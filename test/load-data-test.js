"use strict";

var chai = require('chai');
chai.use(require('chai-as-promised'));
var expect = chai.expect;
var loadData = require('../lib/load-data');

var loc = './test';

describe('loadData', function() {
    it('should return a map of buffers', function(done) {
        expect(loadData(loc))
            .to.eventually.have.property('load-data-test.js')
            .that.is.an.instanceof(Buffer, 'produced map should include buffer for this file')
            .notify(done);
    });
});
