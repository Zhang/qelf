'use strict';

var _ = require('lodash');
var path = require('path');
var cordovaCli = require('cordova');
var spawn = process.platform === 'win32' ? require('win-spawn') : require('child_process').spawn;
var isBrowser = process.env.BROWSER;

//10.0.2.2 is an ip reserved by android emulator to connect to local servers
var LOCAL_HOST_ADDRESS = isBrowser ? 'http://127.0.0.1:3000/' : 'http://10.0.2.2:3000/';
module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.loadNpmTasks('grunt-html-build');
  grunt.loadNpmTasks('grunt-contrib-less');

  // Define the configuration for all the tasks
  grunt.initConfig({
    bowerPath: '<%= yeoman.app %>/bower_components',
    // Project settings
    yeoman: {
      // configurable paths
      app: 'app',
      scripts: 'scripts',
      styles: 'styles',
      images: 'images',
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
        name: 'config',
        dest: '<%= yeoman.app %>/<%= yeoman.scripts %>/configuration.js'
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
            apiEndpoint: 'http://api.yoursite.com/'
          }
        }
      }
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['htmlbuild:dist', 'newer:copy:app']
      },
      html: {
        files: ['<%= yeoman.app %>/**/*.html'],
        tasks: ['htmlbuild:dist', 'newer:copy:app']
      },
      js: {
        files: ['<%= yeoman.app %>/<%= yeoman.scripts %>/**/*.js'],
        tasks: ['htmlbuild:dist', 'newer:copy:app']
      },
      less: {
        files: ['<%= yeoman.app %>/<%= yeoman.styles %>/**/*.less'],
        tasks: ['less:build', 'newer:copy:styles', 'newer:copy:tmp']
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
        '<%= yeoman.app %>/<%= yeoman.scripts %>/**/*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/unit/**/*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.temp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.temp'
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
        src: '<%= yeoman.app %>/index.html',
        dest: 'www/',
        options: {
          beautify: true,
          replace: false,
          relative: false,
          removeRoot: '<%= yeoman.app %>/',
          scripts: {
            bower: [
              '<%= bowerPath %>/ionic/release/js/ionic.bundle.js',
              '<%= bowerPath %>/angular-resource/angular-resource.js',
              '<%= bowerPath %>/collide/collide.js',
              '<%= bowerPath %>/ionic-ion-tinder-cards/ionic.tdcards.js',
              '<%= bowerPath %>/lodash/lodash.js',
              '<%= bowerPath %>/ngCordova/dist/ng-cordova.js'
            ],
            app: ['<%= yeoman.app %>/scripts/**/*.js']
          },
          styles: {
            app: ['<%= yeoman.app %>/<%= yeoman.styles %>/**/*.css'],
            bower: [
              '<%= bowerPath %>/ionic/release/css/ionic.css',
              '<%= bowerPath %>/ionic-ion-tinder-cards/ionic.tdcards.css'
            ],
          }
        }
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '<%= yeoman.images %>/**/*.{png,jpg,jpeg,gif,webp,svg}',
            '*.html',
            '<%= yeoman.styles %>/**/*.html',
            'fonts/*'
          ]
        }, {
          expand: true,
          cwd: '.temp/<%= yeoman.images %>',
          dest: '<%= yeoman.dist %>/<%= yeoman.images %>',
          src: ['generated/*']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/<%= yeoman.styles %>',
        dest: '.temp/<%= yeoman.styles %>/',
        src: 'styles.css'
      },
      fonts: {
        expand: true,
        cwd: 'app/bower_components/ionic/release/fonts/',
        dest: '<%= yeoman.app %>/fonts/',
        src: '*'
      },
      vendor: {
        expand: true,
        cwd: '<%= yeoman.app %>/vendor',
        dest: '.temp/<%= yeoman.styles %>/',
        src: '{,*/}*.css'
      },
      app: {
        expand: true,
        cwd: '<%= yeoman.app %>',
        dest: '<%= yeoman.dist %>/',
        src: [
          '**/*',
          '!**/*.(less,css)',
        ]
      },
      tmp: {
        expand: true,
        cwd: '.temp',
        dest: '<%= yeoman.dist %>/',
        src: '**/*'
      }
    },

    less: {
      build: {
        files: {
          '<%= yeoman.app %>/styles/styles.css': '<%= yeoman.app %>/styles/app.less'
        },
        options: {
          cleancss: true,
          strictMath: true
        }
      }
    },

    // Test settings
    // These will override any config options in karma.conf.js if you create it.
    karma: {
      options: {
        basePath: '',
        frameworks: ['mocha', 'chai'],
        files: [
          '<%= yeoman.app %>/bower_components/angular/angular.js',
          '<%= yeoman.app %>/bower_components/angular-mocks/angular-mocks.js',
          '<%= yeoman.app %>/bower_components/angular-animate/angular-animate.js',
          '<%= yeoman.app %>/bower_components/angular-sanitize/angular-sanitize.js',
          '<%= yeoman.app %>/bower_components/angular-ui-router/release/angular-ui-router.js',
          '<%= yeoman.app %>/bower_components/ionic/release/js/ionic.js',
          '<%= yeoman.app %>/bower_components/ionic/release/js/ionic-angular.js',
          '<%= yeoman.app %>/<%= yeoman.scripts %>/**/*.js',
          '<%= yeoman.test %>/mock/**/*.js',
          '<%= yeoman.test %>/spec/**/*.js'
        ],
        autoWatch: false,
        reporters: ['dots', 'coverage'],
        port: 8080,
        singleRun: false,
        preprocessors: {
          // Update this if you change the yeoman config path
          '<%= yeoman.app %>/<%= yeoman.scripts %>/**/*.js': ['coverage']
        },
        coverageReporter: {
          reporters: [
            { type: 'html', dir: 'coverage/' },
            { type: 'text-summary' }
          ]
        }
      },
      unit: {
        // Change this to 'Chrome', 'Firefox', etc. Note that you will need
        // to install a karma launcher plugin for browsers other than Chrome.
        browsers: ['PhantomJS'],
        background: true
      },
      continuous: {
        browsers: ['PhantomJS'],
        singleRun: true,
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
    }

  });

  // Register tasks for all Cordova commands
  _.functions(cordovaCli).forEach(function (name) {
    grunt.registerTask(name, function () {
      this.args.unshift(name.replace('cordova:', ''));
      // Handle URL's being split up by Grunt because of `:` characters
      if (_.contains(this.args, 'http') || _.contains(this.args, 'https')) {
        this.args = this.args.slice(0, -2).concat(_.last(this.args, 2).join(':'));
      }
      var done = this.async();
      var exec = process.platform === 'win32' ? 'cordova.cmd' : 'cordova';
      var cmd = path.resolve('./node_modules/cordova/bin', exec);
      var flags = process.argv.splice(3);
      var child = spawn(cmd, this.args.concat(flags));
      child.stdout.on('data', function (data) {
        grunt.log.writeln(data);
      });
      child.stderr.on('data', function (data) {
        grunt.log.error(data);
      });
      child.on('close', function (code) {
        code = code ? false : true;
        done(code);
      });
    });
  });

  // Wrap ionic-cli commands
  grunt.registerTask('ionic', function() {
    var done = this.async();
    var script = path.resolve('./node_modules/ionic/bin/', 'ionic');
    var flags = process.argv.splice(3);
    var child = spawn(script, this.args.concat(flags), { stdio: 'inherit' });
    child.on('close', function (code) {
      code = code ? false : true;
      done(code);
    });
  });

  grunt.registerTask('test', [
    'clean',
    'karma:unit:start',
  ]);

  grunt.registerTask('init', [
    'clean',
    'ngconstant:development',
    'less:build',
    'newer:copy:app',
    'newer:copy:tmp',
    'htmlbuild:dist'
  ]);


  grunt.registerTask('compress', [
    'clean',
    'ngconstant:production',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'uglify',
    'htmlmin'
  ]);

  grunt.registerTask('coverage', [
    'karma:continuous',
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'karma:continuous',
    'compress'
  ]);
};
