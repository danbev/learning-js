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
        shell: {
            ls: {
                options: {
                    stdout: true
                },
                command: ['ls', 'ls -l'].join('&&')
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
            src: ['tests/**/*_test.js']
          }
        },
        eslint: {
          target: ['src']
        }
    });
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.registerTask('default', ['eslint', 'mochaTest']);
};
