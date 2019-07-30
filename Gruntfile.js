/* eslint indent: [ "warn", 2 ] */

// Generated on 2014-06-19 using generator-angular-fullstack 1.4.3
'use strict';

// Webpack config is exported as a function
var webpackConfig = require('./webpack.config');

var webpackDevelopmentConfig = webpackConfig(process.env, { mode: 'development' });
var webpackProductionConfig = webpackConfig(process.env, { mode: 'production' });

// https://webpack.js.org/configuration/dev-server/#devserver-port
var webpackDevServerPort = parseInt(process.env.WEBPACK_DEV_PORT) || 8080;

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    express: {
      options: {
        port: process.env.PORT || 9000
      },
      dev: {
        options: {
          script: 'server.js',
          debug: process.env.DEBUG_PORT || true
        }
      }
    },

    open: {
      server: {
        url: 'http://localhost:<%= express.options.port %>'
      }
    },

    watch: {
      jsTest: {
        files: ['test/spec/**/*.js'],
        tasks: ['karma']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      express: {
        files: [
          'server.js',
          'index.js',
          'backend/**/*.js',
          'app/js/constant/**/*.js',
        ],
        tasks: ['express:dev', 'wait'],
        options: {
          livereload: parseInt(process.env.LIVERELOAD_PORT) || 35729,
          nospawn: true // Without this option specified express won't be reloaded
        }
      }
    },

    webpack: {
      prod: webpackProductionConfig,
      dev: Object.assign(webpackDevelopmentConfig, {
        keepalive: false,
      })
    },

    // @see https://github.com/webpack/docs/wiki/usage-with-grunt
    // @see https://github.com/webpack/webpack-with-common-libs/blob/master/Gruntfile.js
    'webpack-dev-server': {
      options: {
        webpack: webpackDevelopmentConfig,
        // TODO Parameterize via env for Docker / local
        host: '0.0.0.0',
        port: webpackDevServerPort,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        watchOptions: {
          poll: true
        }
      },
      start: {
        keepalive: false,
      }
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    env: {
      test: {
        NODE_ENV: 'test'
      }
    },

  });

  grunt.loadNpmTasks('grunt-webpack');

  // Used for delaying livereload until after server has restarted
  grunt.registerTask('wait', function () {
    grunt.log.ok('Waiting for server reload…');

    var done = this.async();

    setTimeout(function () {
      grunt.log.writeln('Done waiting!');
      done();
    }, 500);
  });

  grunt.registerTask('serve', function () {
    var tasks = [
      'webpack:dev',
      'express:dev',
      'webpack-dev-server:start',
      'open',
      'watch'
    ];

    // Remove "open" task
    if (true === grunt.option('no-open')) {
      tasks.splice(tasks.indexOf('open'), 1);
    }

    grunt.task.run(tasks);
  });

  grunt.registerTask('test', [
    'karma'
  ]);

  grunt.registerTask('default', [
    'webpack:prod',
    'test',
  ]);
};
