module.exports = function (grunt) {

    /*
        Grunt set-up:
            npm install -g grunt-cli
            npm install -g grunt-init (seems this isn't necessary if you already have a package.json file created)
            npm init (same as above: make sure there is an empty package.json file and a README.md file - you'll need to add "grunt": "~0.4.0" to `devDependencies` inside package.json)

        Requirements: the following commands should be run on every project + the `--save-dev` flag updates the package.json file with the dependency name
            npm install grunt --save-dev
            npm install grunt@VERSION --save-dev
            npm install grunt@devel --save-dev
            npm install grunt-contrib-watch --save-dev            
            npm install grunt-contrib-jshint --save-dev
                At time of testing I needed a more up to date version of jshint: npm install https://github.com/gruntjs/grunt-contrib-jshint/archive/7fd70e86c5a8d489095fa81589d95dccb8eb3a46.tar.gz --save-dev
            npm install grunt-contrib-uglify --save-dev
            npm install grunt-contrib-requirejs --save-dev
            npm install grunt-contrib-sass --save-dev
            npm install grunt-contrib-imagemin --save-dev
            npm install grunt-contrib-htmlmin --save-dev
            npm install grunt-contrib-jasmine --save-dev
            npm install grunt-template-jasmine-istanbul --save-dev
    */

    // Project configuration.
    grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    /*
    uglify: {
        options: {
          banner: '/*! <%= pkg.name %> | <%= pkg.version %> | <%= grunt.template.today("yyyy-mm-dd") %> /\n'
        },
        dist: {
            src: './<%= pkg.name %>.js',
            dest: './<%= pkg.name %>.min.js'
        }
    },
    */

    jshint: {
        /*
            Note:
            In case there is a /release/ directory found, we don't want to lint that 
            so we use the ! (bang) operator to ignore the specified directory
        */
        files: ['Gruntfile.js', 'app/**/*.js', '!app/release/**', 'modules/**/*.js'],
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
                module: true,
                require: true,
                requirejs: true,
                jQuery: true,
                console: true,
                define: true
            }
        }
    },

    requirejs: {
        compile: {
            options: {
                baseUrl: './app',
                mainConfigFile: './app/main.js',
                dir: './app/release/',
                fileExclusionRegExp: /^\.|node_modules|Gruntfile|\.md|package.json/,
                // optimize: 'none',
                modules: [
                    {
                        name: 'main'
                        // include: ['module'],
                        // exclude: ['module']
                    }
                ]
            }
        }
    },

    sass: {
        dist: {
            options: {
                style: 'compressed'
            },
            src: ['./app/styles/sass/main.scss'],
            dest: './app/styles/main.css'
        },
        dev: {
            options: {
                style: 'expanded'
            },
            src: ['./app/styles/sass/main.scss'],
            dest: './app/styles/main.css'
        }
    },

    // `optimizationLevel` is only applied to PNG files (not JPG)
    imagemin: {
        // dist: {
        //     options: {
        //         optimizationLevel: 7,
        //         progressive: true
        //     },
        //     files: [
        //         {
        //             src: ['./app/images/*'],
        //             dest: './app/images/compressed/'
        //         }
        //     ]
        // }

        dist: {
            options: {
                optimizationLevel: 7,
                progressive: true
            },
            files: [
                {
                    expand: true,
                    cwd: './app/images/',
                    src: ['**/?.png'],
                    dest: 'compressed/',
                    ext: '.min.png'
                }
            ]
        }

        // options: {
        //     basePath: './'
        // },
        // img: 'app/images/**'
    },

    htmlmin: {
        dist: {
            options: {
                removeComments: true,
                collapseWhitespace: true,
                removeEmptyAttributes: true,
                removeCommentsFromCDATA: true,
                removeRedundantAttributes: true,
                collapseBooleanAttributes: true
            },
            files: {
                // Destination : Source
                './index-min.html': './index.html'
            }
        }
    },

    // Run: `grunt watch` from command line for this section to take effect
    watch: {
        files: ['<%= jshint.files %>', '<%= sass.dev.src %>'],
        tasks: 'default'
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
    grunt.registerTask('default', ['jshint', 'sass:dev']);

    // Release Task
    grunt.registerTask('release', ['requirejs', 'sass:dist', 'imagemin', 'htmlmin']);

    /*
        Notes: 

        When registering a new Task we can also pass in any other registered Tasks.
        e.g. grunt.registerTask('release', 'default requirejs'); // when running this task we also run the 'default' Task

        To run specific sub tasks then use a colon, like so...
        grunt sass:dev
        grunt sass:dist
    */

};
