'use strict';

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({

        jshint: {
            server: {
                options: {
                    jshintrc: 'lib/.jshintrc'
                },
                src: ['*.js', 'lib/**/*.js']
            },
            browser: {
                files: {
                    src: ['app/js/**/*.js']
                }
            },
            options: {
                jshintrc: '.jshintrc',
            }
        },

        // ## //

        browserify: {
            dist: {
                src: 'lib/client/common.js',
                dest: 'dist/common.js'
            }
        },

        // ## //

        watch: {
            jshint: {
                files: ['lib/**/*.js', 'app/js/**/*.js', '*.js'],
                tasks: ['jshint']
            },
            browserify: {
                files: ['lib/**/*.js', 'app/js/**/*.js', '*.js'],
                tasks: ['browserify:dist']
            }
        },

        // ## //

        bower: {
            install: {
                options: {
                    copy: false
                }
            }
        }

    });

    grunt.registerTask('default', [
        'jshint',
        'browserify:dist'
    ]);

    grunt.registerTask('build', [
        'bower:install',
        'jshint',
        'browserify:dist'
    ]);

    grunt.registerTask('heroku:development', [
        'bower:install',
        'jshint',
        'browserify:dist'
    ]);

};