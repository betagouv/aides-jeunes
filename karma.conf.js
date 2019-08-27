/* eslint indent: [ "warn", 2 ] */

// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

// https://circleci.com/docs/2.0/env-vars/#built-in-environment-variables
process.env.CHROMIUM_BIN = require('puppeteer').executablePath();
var isCircleCI = process.env.CIRCLECI && process.env.CIRCLECI === 'true';
var useProductionAssets = isCircleCI || process.env.NODE_ENV === 'production';

var files = [];
if (useProductionAssets) {
  files = [
    // On CircleCI, we test against production build
    'dist/js/vendors~scripts~scripts.recapSituation.*.js',
    'dist/js/vendors~scripts.*.js',
    'dist/js/scripts.recapSituation.*.js',
    'dist/js/scripts.*.js',
  ];
} else {
  // TODO Make sure Webpack DevServer is running (?)

  // https://webpack.js.org/configuration/dev-server/#devserver-port
  var port = parseInt(process.env.WEBPACK_DEV_PORT) || 8080;

  files = [
    // Serve files from Webpack DevServer
    'http://localhost:' + port + '/js/vendors~scripts~scripts.recapSituation.js',
    'http://localhost:' + port + '/js/vendors~scripts.js',
    'http://localhost:' + port + '/js/scripts~scripts.recapSituation.js',
    'http://localhost:' + port + '/js/scripts.js',
  ];
}

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: files.concat([
      'node_modules/angular-mocks/angular-mocks.js',
      'test/spec/**/*.js',
    ]),

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8002,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [isCircleCI ? 'ChromiumHeadlessNoSandbox' : 'ChromiumHeadless'],

    // https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#setting-up-chrome-linux-sandbox
    customLaunchers: {
      ChromiumHeadlessNoSandbox: {
        base: 'ChromiumHeadless',
        flags: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    },

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
