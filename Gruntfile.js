module.exports = function(grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        jshint: {
            all: [
                '*.js',
                'lib/**/*.js'
            ],
            options: {
                
            }
        },

        // ## //

        browserify: {
            dist: {
                src: 'lib/client/main.js',
                dest: 'dist/main.js'
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
        }

    });

    grunt.registerTask('default', [
        'jshint:all',
        'browserify:dist'
    ]);

};