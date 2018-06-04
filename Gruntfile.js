/* jshint indent: 2 */

// Generated on 2014-06-19 using generator-angular-fullstack 1.4.3
'use strict';

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
    build: {
      dist: 'dist',
    },
    // Project settings
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      tmp: 'tmp'
    },
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
      js: {
        files: ['<%= yeoman.app %>/js/**/*.js', '<%= yeoman.app %>/../backend/**/*.js'],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['test/spec/**/*.js'],
        tasks: ['karma']
      },
      sass: {
        files: ['<%= yeoman.app %>/styles/**/*.{scss,sass}'],
        tasks: ['sass', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        files: [
          '<%= yeoman.app %>/views/{,*//*}*.html',
          '{.tmp,<%= yeoman.app %>}/styles/{,*//*}*.css',
          '{.tmp,<%= yeoman.app %>}/js/{,*//*}*.js',
          '{.tmp,<%= yeoman.app %>}/../backend/{,*//*}*.js',
          '<%= yeoman.app %>/img/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
        ],

        options: {
          livereload: true
        }
      },
      express: {
        files: [
          'server.js',
          'index.js'
        ],
        tasks: ['newer:jshint:node', 'express:dev', 'wait'],
        options: {
          livereload: true,
          nospawn: true //Without this option specified express won't be reloaded
        }
      }
    },
    jscs: {
        src: ['<%= yeoman.app %>/js/**/*.js'],
        options: {
            config: '.jscsrc'
        }
    },

    // Empties folders to start fresh
    clean: {
      tmp: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.tmp %>/*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version', 'firefox >= 20']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Debugging with node inspector
    'node-inspector': {
      custom: {
        options: {
          'web-host': 'localhost'
        }
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

    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/styles',
          src: '**/*.scss',
          dest: '<%= yeoman.tmp %>/styles',
          ext: '.css'
        }],
        options: {
          includePaths: ['<%= yeoman.app %>/bower_components']
        }
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.tmp %>/js/{,*/}*.js',
            '<%= yeoman.tmp %>/styles/{,*/}*.css',
            '<%= yeoman.tmp %>/styles/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: ['<%= yeoman.app %>/views/front.html', '<%= yeoman.app %>/views/embed.html'],
      options: {
        dest: '<%= yeoman.tmp %>'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.tmp %>/views/{,*/}*.html'],
      options: {
        assetsDirs: ['<%= yeoman.tmp %>']
      }
    },

    htmlmin: {
      dist: {
        options: {
          //collapseWhitespace: true,
          //collapseBooleanAttributes: true,
          //removeCommentsFromCDATA: true,
          //removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/views',
          src: ['**/*.html'],
          dest: '<%= yeoman.tmp %>/views'
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/js',
          src: '*.js',
          dest: '.tmp/concat/js'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      tmp: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.tmp %>',
          src: [
            '*.{ico,png,txt}',
            'bower_components/**/*',
            'img/**/*',
            'fonts/**/*',
            'resources/**/*',
            'documents/**/*',
            'styles/**/*.css'
          ]
        }, {
          expand: true,
          cwd: '.tmp/img',
          dest: '<%= yeoman.tmp %>/img',
          src: ['generated/*']
        }]
      },
      dist: {
        files: [{
          expand: true,
          dot: true,
            cwd: 'tmp',
            dest: 'dist',
            src: [
            '**/*'
            ]
        }]
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'sass'
      ],
      test: [
        'sass'
      ],
      debug: {
        tasks: [
          'nodemon',
          'node-inspector'
        ],
        options: {
          logConcurrentOutput: true
        }
      },
      dist: [
        'sass:dist',
        'htmlmin'
      ]
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

    htmlrefs: {
      dist: {
        src: './<%= yeoman.tmp %>/views/front.html',
        dest: './<%= yeoman.tmp %>/views/front.html'
      }
    }
  });

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
        'clean:server',
        'concurrent:server',
        'autoprefixer',
        'concurrent:debug'
      ]);
    }

    var tasks = [
        'clean:server',
        'concurrent:server',
        'autoprefixer',
        'express:dev',
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
    'clean:server',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:tmp',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:tmp',
    'uglify',
    'rev',
    'usemin',
    'htmlrefs:dist',
    'copy:dist'
  ]);

  grunt.registerTask('default', [
    'jscs',
    'test',
    'build'
  ]);
};
