/* jshint indent: 2 */

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
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'app/bower_components/ngstorage/ngStorage.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/angular-animate/angular-animate.js',
      'app/bower_components/moment/min/moment.min.js',
      'app/bower_components/lodash/dist/lodash.compat.js',
      'app/bower_components/angular-ui-router/release/angular-ui-router.js',
      'app/bower_components/angular-bootstrap/ui-bootstrap.js',
      'app/bower_components/angular-uuids/angular-uuid.js',
      'app/bower_components/lodash/dist/lodash.compat.js',
      'app/js/embed.js',    // depth-first glob interpretation of karma test runner means we need a forward declaration of the module
      'app/js/**/*.js',
      'test/spec/**/*.js',
      'app/views/**/*.html',
      'node_modules/cleave.js/dist/cleave.js',
      'node_modules/angulartics/dist/angulartics.min.js',
      'node_modules/angulartics-piwik/dist/angulartics-piwik.min.js',
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
