module.exports = function(grunt) {
    require('matchdep').filter('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        jshint: {
            all: [
                '*.js',
                'lib/**/*.js',
                'app/js/**/*.js'
            ],
            options: {
                
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
                files: ['lib/**/*.js', 'public/js/**/*.js', '*.js'],
                tasks: ['jshint:all']
            },
            browserify: {
                files: ['lib/**/*.js', 'public/js/**/*.js', '*.js'],
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
        'jshint:all',
        'browserify:dist'
    ]);

    grunt.registerTask('heroku:development', [
        'bower:install',
        'jshint:all',
        'browserify:dist'
    ]);

};