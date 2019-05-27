#! /usr/bin/env node
const bunyan = require('bunyan');
global.global_logger = bunyan.createLogger({
  name: 'test-runner',
  serializers: bunyan.stdSerializers,
  level: 'info'
});
const logger = global.global_logger;
const path = require('path');
const { runQunitPuppeteer, printOutput } = require('./qunit-runner');

let targetUrl = 'file://' + path.join(process.cwd(), process.argv[2]);
let testDataDir = path.join(process.cwd(), process.argv[3]);

logger.info('running test', targetUrl, testDataDir);
runQunitPuppeteer({
  testDataDir: testDataDir,
  targetUrl: targetUrl,
  puppeteerArgs: ['--allow-file-access-from-files']
})
  .then((result) => {
    // Print the test result to the output
    printOutput(result, console);
    if (result.stats.failed > 0) {
      // Handle the failed test run
      process.exit(1);
    } else {
      process.exit(0);
    }
  })
  .catch((ex) => {
    console.error(ex);
    process.exit(1);
  });
