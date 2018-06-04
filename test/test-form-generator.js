"use strict";

var fs = require('mz/fs');
var rimraf = require('rimraf');
var assert = require('chai').assert;
var formGenerator = require('../lib/form-generator');

var formDir = __dirname + '/../test-data/forms';
var dataDir = __dirname + '/../temp';

var expectedResultFile = __dirname + '/../test-data/forms-expected/some-form-expected.js';

describe('generateForms', () => {
  before(() => {
    return fs.mkdir(dataDir);
  });

  after(() => {
    rimraf.sync(dataDir);
  });

  it('should generate a simple form', () => {
    return formGenerator.generateForms(formDir, dataDir)
    .then(() => fs.readFile(expectedResultFile))
    .then((expectedBuffer) => {
      return fs.readFile(dataDir + '/some-form.js').then((actualBuffer) => {
        assert.equal(actualBuffer.toString(), expectedBuffer.toString(), 'expecting specific output, see files');
      });
    });
  });
});