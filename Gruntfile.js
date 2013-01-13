module.exports = function(grunt) {

  /*
      Grunt set-up:
        npm install -g grunt-cli
        npm install -g grunt-init
        npm init (make sure there is an empty package.json file and a README.md file - you'll need to add "grunt": "~0.4.0" to `devDependencies` inside package.json)

      Requirements: 
        (The following commands should be run on every project + the `--save-dev` flag updates the package.json file with the dependency name)
        npm install grunt --save-dev
            npm install grunt@VERSION --save-dev
            npm install grunt@devel --save-dev
        npm install grunt-contrib-watch --save-dev
        npm install grunt-contrib-jshint --save-dev
        npm install grunt-contrib-uglify --save-dev
        npm install grunt-contrib-requirejs --save-dev
        npm install grunt-contrib-sass --save-dev
        npm install grunt-contrib-imagemin --save-dev
        npm install grunt-contrib-htmlmin --save-dev

   */

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> | <%= pkg.version %> | <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        src: './<%= pkg.name %>.js',
        dest: './<%= pkg.name %>.min.js'
      }
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,

        globals: {
          require: true,
          requirejs: true,
          jQuery: true,
          console: true,
          define: true
        }
      },
      /*
          In case there is a /release/ directory found, we don't want to lint that 
          so we use the ! (bang) operator to ignore the specified directory
       */
      all: ['Gruntfile.js', 'app/**/*.js', '!app/release/**']
    },

    // Run: `grunt watch` from command line for this section to take effect
    watch: {
      files: '<%= jshint.uses_defaults %>',
      tasks: 'jshint' // add space separated list of items to watch
    },

    requirejs: {
      compile: {
        options: {
          baseUrl: './app',
          mainConfigFile: './app/main.js',
          dir: './app/release/',
          //optimize: 'none', // comment out this line to use uglify to compress script content
          modules: [
            {
              name: 'main'
              /*
              include: ['module'],
              exclude: ['module']
              */
            }
          ]
        }
      }
    }

  });

  // Load NPM Tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');

  // Default Task
  grunt.registerTask('default', ['jshint']);

  // Release Task
  grunt.registerTask('release', ['requirejs']);

  /*
      Notes: 

      When registering a new Task we can also pass in any other registered Tasks.
      e.g. grunt.registerTask('release', 'default requirejs'); // when running this task we also run the 'default' Task
   */

};
