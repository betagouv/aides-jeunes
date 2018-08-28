/* eslint indent: [ "warn", 2 ] */

// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'tmp/js/*vendor.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'app/js/embed.js',    // depth-first glob interpretation of karma test runner means we need a forward declaration of the module
      'app/js/**/*.js',
      'test/spec/**/*.js',
      'app/views/**/*.html',
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    preprocessors: {
      '**/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'app/views',
      moduleName: 'templates'
    },

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
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
