/* eslint indent: [ "warn", 2 ] */

// Generated on 2014-06-19 using generator-angular-fullstack 1.4.3
'use strict';

// Webpack config is exported as a function
var webpackConfig = require('./webpack.config');

var webpackDevelopmentConfig = webpackConfig(process.env, { mode: 'development' });
var webpackProductionConfig = webpackConfig(process.env, { mode: 'production' });

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    express: {
      options: {
        port: process.env.PORT || 9000
      },
      dev: {
        options: {
          script: 'server.js',
          debug: true
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
          livereload: true,
          nospawn: true // Without this option specified express won't be reloaded
        }
      },
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
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        // Activate this option if watching doesn't work on your machine
        // watchOptions: {
        //   poll: true
        // }
      },
      start: {
        keepalive: false,
      }
    },

    // Use nodemon to run server in debug mode with an initial breakpoint
    nodemon: {
      debug: {
        script: 'server.js',
        options: {
          nodeArgs: ['--debug-brk'],
          env: {
            PORT: process.env.PORT || 9000
          },
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });

            // opens browser on initial server start
            nodemon.on('config:update', function () {
              setTimeout(function () {
                require('open')('http://localhost:8080/debug?port=5858');
              }, 500);
            });
          }
        }
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      debug: {
        tasks: [
          'nodemon',
        ],
        options: {
          logConcurrentOutput: true
        }
      },
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

  grunt.registerTask('serve', function (target) {
    if (target === 'debug') {
      return grunt.task.run([
        'concurrent:debug'
      ]);
    }

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
