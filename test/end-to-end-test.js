// "use strict";

// var chai = require('chai');
// chai.use(require('chai-as-promised'));
// var expect = chai.expect;
// var path = require('path');

// var rootLoc = path.join(path.dirname(require.resolve('../index')), 'test-data');
// var confLoc = path.join(rootLoc, 'conf');
// var dataLoc = path.join(rootLoc, 'widgets');

// var confUtil = require('../index');

// // TODO: Convert to promises


// describe('End-to-end test', function() {
//     it('should prepare test configuration', function(done) {
//         expect(confUtil.prepareConf(confLoc, dataLoc, 'test-conf'))
//             .to.eventually.have.property('load-data-test.js')
//             .that.is.an.instanceof(Buffer, 'produced map should include buffer for this file')
//             .notify(done);
//     });
// });
// module.exports = confUtil.prepareConf(confLoc, dataLoc, 'conf-aau', [ models ]);
