/* global module */
module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        availabletasks: {
            tasks: {}
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
                    'tests/vendor/jquery-2.0.3.js',
                    'tests/vendor/jasmine-jquery.js',
                    'node_modules/alchemy.js/lib/core/Alchemy.js',
                    'node_modules/alchemy.js/lib/core/**/*.js',
                    'node_modules/alchemy.js/lib/web/**/*.js',
                    'node_modules/alchemy.js/lib/ecs/**/*.js',
                    'node_modules/alchemy.js/lib/vendor/**/*.js',
                ],
            },

            all: {
                src: [ 'src/js/todo/**/*.js' ],
            },

            coverage: {
                src: [ 'src/js/todo/**/*.js' ],
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
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    // define aliases
    grunt.registerTask('default', ['availabletasks']);
    grunt.registerTask('test', ['jshint', 'jasmine:all']);
};
