module.exports = function(grunt) {
    require('matchdep').filter('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        jshint: {
            server: {
                files: {
                    src: ['*.js', 'lib/**/*.js']
                },
                options: {
                    node: true
                }
            },
            browser: {
                files: {
                    src: ['app/js/**/*.js']
                },
                options: {
                    browser: true,
                    devel: true,
                    globals: {
                        angular: true,
                        situation: true,
                        questions: true,
                        prestations: true,
                        rsa: true,
                        aideLogement: true,
                        moment: true,
                        _: true,
                        _s: true
                    }
                }
            },
            options: {
                bitwise: true,
                eqeqeq: true,
                freeze: true,
                immed: true,
                indent: 4,
                latedef: true,
                newcap: true,
                nonew: true,
                quotmark: 'single',
                undef: true,
                unused: true,
                trailing: true,
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