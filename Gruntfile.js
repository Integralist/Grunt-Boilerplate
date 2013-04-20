module.exports = function (grunt) {

    /*
        Grunt installation:
        -------------------
            npm install -g grunt-cli
            npm install -g grunt-init
            npm init (creates a `package.json` file)

        Project Dependencies:
        ---------------------
            npm install grunt --save-dev
            npm install grunt-contrib-watch --save-dev            
            npm install grunt-contrib-jshint --save-dev
            npm install grunt-contrib-uglify --save-dev
            npm install grunt-contrib-requirejs --save-dev
            npm install grunt-contrib-sass --save-dev
            npm install grunt-contrib-imagemin --save-dev
            npm install grunt-contrib-htmlmin --save-dev
            npm install grunt-contrib-jasmine --save-dev
            npm install grunt-template-jasmine-requirejs --save-dev
            npm install grunt-template-jasmine-istanbul --save-dev
                Seems there is a compatability issue with Grunt:
                https://github.com/maenu/grunt-template-jasmine-istanbul-example/issues/1
    */

    // Project configuration.
    grunt.initConfig({

        // Store your Package file so you can reference its specific data whenever necessary
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

        jasmine: {
            /*
                Note:
                In case there is a /release/ directory found, we don't want to run tests on that 
                so we use the ! (bang) operator to ignore the specified directory
            */
            src: ['app/**/*.js', '!app/release/**'],
            options: {
                specs: 'specs/**/*Spec.js',
                helpers: ['specs/helpers/*Helper.js', 'specs/helpers/sinon.js'],
                template: require('grunt-template-jasmine-requirejs'),
                templateOptions: {
                    requireConfig: {
                        baseUrl: './app/',
                        mainConfigFile: './app/main.js'
                    }
                }
                /*
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: './reports/coverage.json',
                        report: './reports/coverage',

                        template: require('grunt-template-jasmine-requirejs'),
                        templateOptions: {
                            requireConfig: {
                                // baseUrl: './app/',
                                // mainConfigFile: './app/main.js'
                                baseUrl: '.grunt/grunt-contrib-jasmine/app',
                                mainConfigFile: '.grunt/grunt-contrib-jasmine/app/main.js'
                            }
                        }
                    }
                */
            }
        },

        jshint: {
            /*
                Note:
                In case there is a /release/ directory found, we don't want to lint that 
                so we use the ! (bang) operator to ignore the specified directory
            */
            files: ['Gruntfile.js', 'app/**/*.js', '!app/release/**', 'modules/**/*.js', 'specs/**/*Spec.js'],
            options: {
                curly:   true,
                eqeqeq:  true,
                immed:   true,
                latedef: true,
                newcap:  true,
                noarg:   true,
                sub:     true,
                undef:   true,
                boss:    true,
                eqnull:  true,
                browser: true,

                globals: {
                    // AMD
                    module:     true,
                    require:    true,
                    requirejs:  true,
                    define:     true,

                    // Environments
                    console:    true,

                    // General Purpose Libraries
                    $:          true,
                    jQuery:     true,

                    // Testing
                    sinon:      true,
                    describe:   true,
                    it:         true,
                    expect:     true,
                    beforeEach: true,
                    afterEach:  true
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
                    style: 'compressed',
                    require: ['./assets/styles/sass/helpers/url64.rb']
                },
                expand: true,
                cwd: './app/styles/sass/',
                src: ['*.scss'],
                dest: './app/styles/',
                ext: '.css'
            },
            dev: {
                options: {
                    style: 'expanded',
                    debugInfo: true,
                    lineNumbers: true,
                    require: ['./app/styles/sass/helpers/url64.rb']
                },
                expand: true,
                cwd: './app/styles/sass/',
                src: ['*.scss'],
                dest: './app/styles/',
                ext: '.css'
            }
        },

        // `optimizationLevel` is only applied to PNG files (not JPG)
        imagemin: {
            png: {
                options: {
                    optimizationLevel: 7
                },
                files: [
                    {
                        expand: true,
                        cwd: './app/images/',
                        src: ['**/*.png'],
                        dest: './app/images/compressed/',
                        ext: '.png'
                    }
                ]
            },
            jpg: {
                options: {
                    progressive: true
                },
                files: [
                    {
                        expand: true,
                        cwd: './app/images/',
                        src: ['**/*.jpg'],
                        dest: './app/images/compressed/',
                        ext: '.jpg'
                    }
                ]
            }
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
            files: ['<%= jshint.files %>', '<%= jasmine.options.specs %>', '<%= sass.dev.src %>'],
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
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    // Default Task
    grunt.registerTask('default', ['jshint', 'jasmine', 'sass:dev']);

    // Release Task
    grunt.registerTask('release', ['jshint', 'jasmine', 'requirejs', 'sass:dist', 'imagemin', 'htmlmin']);

    /*
        Notes: 

        When registering a new Task we can also pass in any other registered Tasks.
        e.g. grunt.registerTask('release', 'default requirejs'); // when running this task we also run the 'default' Task

        We don't do this above as we would end up running `sass:dev` when we only want to run `sass:dist`
        We could do it and `sass:dist` would run afterwards, but that means we're compiling sass twice which (although in our example quick) is extra compiling time.

        To run specific sub tasks then use a colon, like so...
        grunt sass:dev
        grunt sass:dist
    */

};
