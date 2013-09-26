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
            npm install grunt-contrib-connect --save-dev
            npm install grunt-contrib-jasmine --save-dev
            npm install grunt-template-jasmine-requirejs --save-dev
            npm install grunt-template-jasmine-istanbul --save-dev
            npm install load-grunt-tasks --save-dev
            npm install time-grunt --save-dev

        Simple Dependency Install:
        --------------------------
            npm install (from the same root directory as the `package.json` file)

        Gem Dependencies:
        -----------------
            gem install image_optim
    */

    // Displays the elapsed execution time of grunt tasks
    require('time-grunt')(grunt);

    // Load NPM Tasks
    require('load-grunt-tasks')(grunt, ['grunt-*', '!grunt-template-jasmine-istanbul', '!grunt-template-jasmine-requirejs']);

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

        // Used to connect to a locally running web server (so Jasmine can test against a DOM)
        connect: {
            test: {
                port: 8000
            }
        },

        jasmine: {
            run: {
                /*
                    Note:
                    In case there is a /release/ directory found, we don't want to run tests on that
                    so we use the ! (bang) operator to ignore the specified directory
                */
                src: ['app/**/*.js', '!app/release/**'],
                options: {
                    host: 'http://127.0.0.1:8000/',
                    specs: 'specs/**/*Spec.js',
                    helpers: ['specs/helpers/*Helper.js', 'specs/helpers/sinon.js'],
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfig: {
                            baseUrl: './app/',
                            mainConfigFile: './app/main.js'
                        }
                    }
                }
            },
            coverage: {
                src: ['app/**/*.js', '!app/release/**'],
                options: {
                    specs: 'specs/**/*Spec.js',
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: 'bin/coverage/coverage.json',
                        report: [
                            {
                                type: 'html',
                                options: {
                                    dir: 'bin/coverage//html'
                                }
                            },
                            {
                                type: 'text-summary'
                            }
                        ],
                        // 1. don't replace src for the mixed-in template with instrumented sources
                        replace: false,
                        template: require('grunt-template-jasmine-requirejs'),
                        templateOptions: {
                            requireConfig: {
                                // 2. use the baseUrl you want
                                baseUrl: './app/',
                                // 3. pass paths of the sources being instrumented as a configuration option
                                //    these paths should be the same as the jasmine task's src
                                //    unfortunately, grunt.config.get() doesn't work because the config is just being evaluated
                                config: {
                                    instrumented: {
                                        src: grunt.file.expand('./app/*.js')
                                    }
                                },
                                // 4. use this callback to read the paths of the sources being instrumented and redirect requests to them appropriately
                                callback: function () {
                                    define('instrumented', ['module'], function (module) {
                                        return module.config().src;
                                    });
                                    require(['instrumented'], function (instrumented) {
                                        var oldLoad = requirejs.load;
                                        requirejs.load = function (context, moduleName, url) {
                                            // normalize paths
                                            if (url.substring(0, 1) === '/') {
                                                url = url.substring(1);
                                            } else if (url.substring(0, 2) === './') {
                                                url = url.substring(2);
                                            }
                                            // redirect
                                            if (instrumented.indexOf(url) > -1) {
                                                url = './.grunt/grunt-contrib-jasmine/' + url;
                                            }
                                            return oldLoad.apply(this, [context, moduleName, url]);
                                        };
                                    });
                                }
                            }
                        }
                    }
                }
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
                    require: ['./app/styles/sass/helpers/url64.rb']
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

    // Default Task
    grunt.registerTask('default', ['jshint', 'connect', 'jasmine', 'sass:dev']);

    // Unit Testing Task
    grunt.registerTask('test', ['connect', 'jasmine:run']);

    // Release Task
    grunt.registerTask('release', ['jshint', 'test', 'requirejs', 'sass:dist', 'imagemin', 'htmlmin']);

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
