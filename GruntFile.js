/*global module:false, require:false*/
module.exports = function(grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/core/core.js',
                dest: 'build/core.min.js'
            }
        },
        qunit: {
            files: ['tests/core/core.html', 
                'tests/nulls/null.html', 
                'tests/booleans/boolean.html', 
                'tests/strings/strings.html', 
                'tests/equals/equals.html', 
                'tests/algorithms/algorithms.html',]
        },
        shell: {
            ls: {
                options: {
                    stdout: true
                },
                command: ['ls', 'ls -l'].join('&&')
            }
        },
        jshint: {
            all: {
                src: [ 'Gruntfile.js', 'src/**/*.js' ],
                options: {
                    jshintrc: '.jshintrc'
                }
            }
        },
        mochaTest: {
          test: {
            options: {
              reporter: 'spec',
              captureFile: 'results.txt', // Optionally capture the reporter output to a file
              quiet: false, // Optionally suppress output to standard out (defaults to false)
              clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
            },
            src: ['tests/**/*_mocha.js']
          }
        }
    });
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.registerTask('default', ['mochaTest']);
};
