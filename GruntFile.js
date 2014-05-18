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
        }
    });
    require('load-grunt-tasks')(grunt);
    grunt.registerTask('default', ['qunit', 'uglify']);
};
