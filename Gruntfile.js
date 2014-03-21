module.exports = function(grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        jshint: {
            all: [
                '*.js',
                'lib/**/*.js',
                'public/js/**/*.js'
            ],
            options: {
                
            }
        },

        // ## //

        watch: {
            jshint: {
                files: ['lib/**/*.js', 'public/js/**/*.js', '*.js'],
                tasks: ['jshint:all']
            }
        }

    });

    grunt.registerTask('default', [
        'jshint:all'
    ]);

};