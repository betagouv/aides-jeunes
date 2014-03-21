module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.initConfig({
        jshint: {
            all: [
                '*.js',
                'lib/**/*.js',
                'public/js/**/*.js'
            ],
            options: {
                
            }
        }
    });

    grunt.registerTask('default', [
        'jshint:all'
    ]);

};