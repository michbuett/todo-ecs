/* global module */
module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        availabletasks: {
            tasks: {}
        },

        'bower-install-simple': {
            all: {
                options: {
                    color: true,
                }
            },
        },

        jshint: {
            files: [ 'Gruntfile.js', 'src/**/*.js', 'tests/specs/**/*.js' ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        jasmine: {
            options: {
                display: 'short',
                keepRunner: true,
                summary: true,
                specs: [
                    'tests/specs/**/*.spec.js'
                ],
                vendor: [
                    'bower_components/michbuett-alchemy/lib/core/Alchemy.js',
                    'bower_components/michbuett-alchemy/lib/core/**/*.js',
                    'bower_components/michbuett-alchemy/lib/web/**/*.js',
                    'bower_components/michbuett-alchemy/lib/ecs/**/*.js',
                    'bower_components/michbuett-alchemy/lib/vendor/**/*.js',
                    'tests/vendor/jquery-2.0.3.js',
                    'tests/vendor/jasmine-jquery.js',
                ],
            },

            all: {
                src: [ 'src/js/todo/**/*.js' ],
            },

            coverage: {
                src: [ 'src/**/*.js' ],
                options: {
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: 'reports/core/coverage.json',
                        report: 'reports/',
                        thresholds: {
                            lines: 85,
                            statements: 85,
                            branches: 80,
                            functions: 90
                        },
                    },
                },
            },

        },

        watch: {
            jshint: {
                files: ['**/*.js'],
                tasks: ['jshint', 'jasmine:all'],
            },
        },
    });


    // load grunt plugins
    grunt.loadNpmTasks('grunt-available-tasks');
    grunt.loadNpmTasks('grunt-bower-install-simple');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    // define aliases
    grunt.registerTask('test', ['bower-install-simple', 'jshint', 'jasmine:all']);
    grunt.registerTask('default', ['availabletasks']);
};
