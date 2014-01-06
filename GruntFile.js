module.exports = function(grunt) {
    'use strict'
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
            files: ['tests/core/core.html']
        }, 
        shell: {
            ls: {
                options: {
                    stdout: true
                },
                command: ['ls', 'ls -l'].join('&&')
            }
        }
    });
    require('load-grunt-tasks')(grunt);
    grunt.registerTask('default', ['qunit', 'uglify']);
};
