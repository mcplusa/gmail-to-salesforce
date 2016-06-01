'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    paths: {
        src: {
            js: 'prototype/js/**/*.js',
            thirdpartyjs: 'prototype/bower_components/**/*.js',
            css: 'prototype/css/**/*.css',
            thirdpartycss: 'prototype/bower_components/**/*.css',
            html: 'prototype/*.html',
            manifest: 'prototype/manifest.json'
        },
        dest: {
            js: 'dist/<%= pkg.name %>.js',
            jsMin: 'dist/<%= pkg.name %>.min.js'
        }
    },

    clean: {
      folder: ['dist']
    },

    copy: {
      build: {
        files: [
          {
            expand:true,
            src: ['<%= paths.src.thirdpartyjs %>'],
            dest: 'dist/js/third-party',
            flatten: true
          },
          {
            expand:true,
            src: ['<%= paths.src.css %>'],
            dest: 'dist/css',
            flatten: true
          },
          {
            expand:true,
            src: ['<%= paths.src.thirdpartycss %>'],
            dest: 'dist/css/third-party',
            flatten: true
          },
          {
            expand:true,
            src: ['<%= paths.src.html %>'],
            dest: 'dist',
            flatten: true
          }
        ]
      }
    },

    uglify: {
      options: {
          compress: {},
          mangle: true,
          sourceMap: false
      },
      build: {
        files: [{
          expand: true,
          flatten: true,
          ext: '.min.js',
          src: '<%= paths.src.js %>',
          dest: 'dist/js'
        }]
      }
    },

    processhtml: {
      options: {
        data: {
          message: "Gmail To Salesforce APP"
        }
      },
      dist: {
        files: {
          'dist/options.html': ['prototype/options.html'],
          'dist/background.html': ['prototype/background.html']
        }
      }
    },

    'string-replace': {
      dist: {
        files: [{
          expand: true,
          flatten: true,
          src: 'prototype/manifest.json',
          dest: 'dist/'
        }],
        options: {
          replacements: [
            {
              pattern: 'js/content_script.js',
              replacement: 'js/content_script.min.js'
            },
            {
              pattern: 'bower_components/*',
              replacement: 'js/third-party/*'
            }
          ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-string-replace');

  grunt.registerTask('build', ['clean', 'copy', 'uglify', 'processhtml', 'string-replace']);
  grunt.registerTask('default', ['uglify']);

};
