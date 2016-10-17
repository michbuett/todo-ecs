/* global module */
module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        availabletasks: {
            tasks: {}
        },

        ///////////////////////////////////////////////////////////////////////
        // TESTS
        //
        jshint: {
            files: [ 'Gruntfile.js', 'src/**/*.js', 'tests/specs/**/*.js' ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        jasmine: {
            options: {
                summary: true,
                vendor: [
                    'tests/vendor/jquery-2.0.3.js',
                    'tests/vendor/jasmine-jquery.js',
                ],
                helpers: [
                    'tests/helper/event.helper.js',
                ],
                specs: [
                    'tests/specs/**/*.js',
                ],
            },

            dev: {
                src: [ 'src/js/todo/**/*.js' ],

                options: {
                    keepRunner: true,
                    template: require('grunt-template-jasmine-nml'),
                }
            },

            coverage: {
                src: [ 'src/js/todo/**/*.js' ],

                options: {
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        template: require('grunt-template-jasmine-nml'),
                        templateOptions: {
                            pathmap: {
                                'src/': '.grunt/grunt-contrib-jasmine/src/',
                            }
                        },
                        coverage: 'reports/coverage/coverage.json',
                        report: [{
                            type: 'html',
                            options: {
                                dir: 'reports/coverage/html',
                            }
                        }, {
                            type: 'lcovonly',
                            options: {
                                dir: 'reports/coverage/lcov',
                            }
                        }],
                        thresholds: {
                            lines: 95,
                            statements: 95,
                            branches: 95,
                            functions: 95
                        },
                    }
                },
            },
        },

        watch: {
            src: {
                files: ['Gruntfile.js', 'src/**/*', 'tests/**/*'],
                tasks: ['debug'],
            },
        },

        connect: {
            dev: {
                options: {
                    livereload: true,
                },
            }
        },

        coveralls: {
            travis: {
                src: 'reports/coverage/lcov/*.info',
                options: {
                    force: true,
                }
            }
        },

        ///////////////////////////////////////////////////////////////////////
        // BUILD
        //
        clean: {
            dist: [ 'tmp/*', 'build/*' ],
        },

        browserify: {
            dist: {
                src: [
                    'src/js/init.js',
                ],
                dest: 'tmp/app.js',
                options: {
                    browserifyOptions: {
                        debug: false,
                    },
                }
            },

            dev: {
                src: [
                    'src/js/init.js',
                ],
                dest: 'build/js/app.min.js',
                options: {
                    browserifyOptions: {
                        debug: true,
                    },
                }
            },
        },

        uglify: {
            dist: {
                files: {
                    'build/js/app.min.js': [ 'tmp/**/*.js' ]
                }
            },
        },

        copy: {
            dist: {
                files: [{
                    src: ['src/index.html'],
                    dest: 'build/',
                    expand: true,
                    flatten: true,
                }, {
                    src: [
                        'node_modules/todomvc-common/base.css',
                        'node_modules/todomvc-app-css/index.css',
                    ],
                    dest: 'build/css/',
                    expand: true,
                    flatten: true,
                }, {
                    src: [ 'node_modules/todomvc-common/base.js', ],
                    dest: 'build/js/',
                    expand: true,
                    flatten: true,
                }]
            },
        },
    });

    // load grunt plugins
    grunt.loadNpmTasks('grunt-available-tasks');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-coveralls');

    // define aliases
    grunt.registerTask('default', ['availabletasks']);
    grunt.registerTask('dev', ['connect', 'watch']);
    grunt.registerTask('test', ['jshint', 'jasmine:coverage']);
    grunt.registerTask('debug', ['jshint', 'jasmine:dev', 'clean', 'browserify:dev', 'copy']);
    grunt.registerTask('dist', ['test', 'clean', 'browserify:dist', 'uglify', 'copy']);
};
