'use strict';

//10.0.2.2 is an ip reserved by android emulator to connect to local servers
const IS_ANDROID = process.env.IS_ANDROID;
const LOCAL_HOST_ADDRESS = IS_ANDROID ? 'http://10.0.2.2:3000/' : 'http://127.0.0.1:3000/';

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({
    bowerPath: 'bower_components',
    // Project settings
    yeoman: {
      // configurable paths
      client: 'client',
      scripts: 'scripts',
      styles: 'styles',
      assets: 'assets',
      test: 'test',
      dist: 'www'
    },

    // Environment Variables for Angular App
    // This creates an Angular Module that can be injected via ENV
    // Add any desired constants to the ENV objects below.
    // https://github.com/diegonetto/generator-ionic/blob/master/docs/FAQ.md#how-do-i-add-constants
    ngconstant: {
      options: {
        space: '  ',
        wrap: '"use strict";\n\n {%= __ngModule %}',
        name: 'ENV_VARS',
        dest: '<%= yeoman.client %>/<%= yeoman.scripts %>/ENV_VARS.js'
      },
      development: {
        constants: {
          ENV: {
            name: 'development',
            apiEndpoint: LOCAL_HOST_ADDRESS
          }
        }
      },
      production: {
        constants: {
          ENV: {
            name: 'production',
            apiEndpoint: 'http://54.153.37.234:8080/'
          }
        }
      }
    },
    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['htmlbuild:dist', 'newer:copy:bower']
      },
      assets: {
        files: ['<%= yeoman.client %>/<%= yeoman.assets %>/**/*.{png,jpg,jpeg,gif,webp,svg,ttf,eot,woff}'],
        tasks: ['htmlbuild:dist', 'newer:copy:assets']
      },
      html: {
        files: ['<%= yeoman.client %>/**/*.html'],
        tasks: ['htmlbuild:dist', 'newer:copy:app']
      },
      js: {
        files: ['<%= yeoman.client %>/<%= yeoman.scripts %>/**/*.js'],
        tasks: ['htmlbuild:dist', 'newer:copy:app']
      },
      less: {
        files: ['<%= yeoman.client %>/<%= yeoman.styles %>/**/*.less'],
        tasks: ['less:build', 'newer:copy:app']
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['ngconstant:development', 'newer:copy:app']
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.client %>/<%= yeoman.scripts %>/**/*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/unit/**/*.js']
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', '<%= yeoman.styles %>/**/*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    htmlbuild: {
      dist: {
        src: '<%= yeoman.client %>/index.html',
        dest: 'www/',
        options: {
          beautify: true,
          replace: false,
          relative: false,
          removeRoot: '<%= yeoman.client %>/',
          scripts: {
            app: [
              '<%= yeoman.client %>/<%= yeoman.scripts %>/**/*.js'
            ],
            bower: [
              '<%= bowerPath %>/ionic/js/ionic.bundle.js',
              '<%= bowerPath %>/jquery/dist/jquery.min.js',
              '<%= bowerPath %>/angular-cookies/angular-cookies.min.js',
              '<%= bowerPath %>/lodash/lodash.min.js',
              '<%= bowerPath %>/javascript-detect-element-resize/jquery.resize.js',
              '<%= bowerPath %>/ngCordova/dist/ng-cordova.min.js'
            ]
          },
          styles: {
            app: ['<%= yeoman.client %>/<%= yeoman.styles %>/**/*.css', '<%= yeoman.client %>/<%= yeoman.assets %>/**/*.css'],
            bower: [],
          }
        }
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      assets: {
        expand: true,
        cwd: '<%= yeoman.client %>/<%= yeoman.assets %>/',
        dest: '<%= yeoman.dist %>/assets',
        src: '**/*.{png,jpg,jpeg,gif,webp,svg,ttf,eot,woff}'
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.client %>/<%= yeoman.styles %>/',
        dest: '<%= yeoman.dist %>/',
        src: 'styles.css'
      },
      app: {
        expand: true,
        cwd: '<%= yeoman.client %>',
        dest: '<%= yeoman.dist %>/',
        src: '**/*.{css,js,html}'
      },
      bower: {
        expand: true,
        cwd: '<%= bowerPath %>',
        dest: '<%= yeoman.dist %>/bower_components',
        src: '**/*.{js,html,css}'
      }
    },

    less: {
      build: {
        files: {
          '<%= yeoman.client %>/styles/styles.css': '<%= yeoman.client %>/styles/app.less'
        },
        options: {
          cleancss: true,
          strictMath: true
        }
      }
    },

    // ngAnnotate tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.temp/concat/<%= yeoman.scripts %>',
          src: '*.js',
          dest: '.temp/concat/<%= yeoman.scripts %>'
        }]
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
        },
        src: ['server/test/**/*.js']
      }
    }
  });

  grunt.registerTask('test', function() {
    if (process.env.NODE_ENV === 'test') {
      grunt.task.run('mochaTest:test');
    } else {
      console.log('please run tests with NODE_ENV=test');
    }
  });

  grunt.registerTask('init', [
    'ngconstant:development',
    'less:build',
    'htmlbuild:dist',
    'newer:copy:app',
    'newer:copy:bower',
    'newer:copy:assets'
  ]);


  grunt.registerTask('compress', [
    'ngconstant:production',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'uglify',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'karma:continuous',
    'compress'
  ]);
};
