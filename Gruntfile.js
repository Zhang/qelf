'use strict';

var _ = require('lodash');
var path = require('path');
var cordovaCli = require('cordova');
var spawn = process.platform === 'win32' ? require('win-spawn') : require('child_process').spawn;
//var isBrowser = process.env.BROWSER;

//10.0.2.2 is an ip reserved by android emulator to connect to local servers
//var LOCAL_HOST_ADDRESS = isBrowser ? 'http://127.0.0.1:3000/' : 'http://10.0.2.2:3000/';
var LOCAL_HOST_ADDRESS = 'http://127.0.0.1:3000/';
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
            apiEndpoint: 'http://api.yoursite.com/'
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
        tasks: ['less:build', 'newer:copy:styles']
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
              '<%= bowerPath %>/angular-cookies/angular-cookies.min.js'
            ]
          },
          styles: {
            app: ['<%= yeoman.client %>/<%= yeoman.styles %>/**/*.css'],
            bower: ['<%= bowerPath %>/ionic/release/css/ionic.css'],
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
          cwd: '<%= yeoman.client %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '<%= yeoman.assets %>/**/*.{png,jpg,jpeg,gif,webp,svg}',
            '*.html',
            '<%= yeoman.styles %>/**/*.html',
            'assets/fonts/*',
            '<%= bowerPath %>/**/*.{js,html,css}'
          ]
        }, {
          expand: true,
          cwd: '.temp/<%= yeoman.assets %>',
          dest: '<%= yeoman.dist %>/<%= yeoman.assets %>',
          src: ['generated/*']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.client %>/<%= yeoman.styles %>/',
        dest: '<%= yeoman.dist %>/',
        src: 'styles.css'
      },
      fonts: {
        expand: true,
        cwd: 'app/bower_components/ionic/release/fonts/',
        dest: '<%= yeoman.client %>/<%= yeoman.assets %>/fonts/',
        src: '*'
      },
      app: {
        expand: true,
        cwd: '<%= yeoman.client %>',
        dest: '<%= yeoman.dist %>/',
        src: [
          '<%= yeoman.scripts %>/**/*.js',
          '**/*.{css,js,html}'
        ]
      },
      bower: {
        expand: true,
        cwd: '<%= bowerPath %>',
        dest: '<%= yeoman.dist %>/',
        src: [
          '**/*.{js,html}'
        ]
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
