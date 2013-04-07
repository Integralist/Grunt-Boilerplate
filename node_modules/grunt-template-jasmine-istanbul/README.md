Code coverage template mix-in for [grunt-contrib-jasmine](https://github.com/gruntjs/grunt-contrib-jasmine), using [istanbul](https://github.com/gotwarlost/istanbul)
-----------------------------------------

## Installation

```
npm install grunt-template-jasmine-istanbul --save-dev
```

## Template Options

### templateOptions.coverage
Type: `String`
Mandatory.

The file path where to store the `coverage.json`.

### templateOptions.report
Type: `String | Object | Array`
Mandatory.

If a `String` is given, it will be used as the path where a HTML report is generated.
If an `Object` is given, it must have the properties `type` and `options`, where `type` is a `String` and `options` an `Object`.
`type` and `options` are used to create the report by passing it to `istanbul`s [`Report.create(type, options)`](http://gotwarlost.github.com/istanbul/public/apidocs/classes/Report.html).
For example, if you want to generate a Cobertura report at `bin/coverage/cobertura`, use this:

````js
report: {
	type: 'cobertura',
	options: {
		dir: 'bin/coverage/cobertura'
	}
}
````

If an `Array` is given, it must consist of `Object`s of the form just described.

### templateOptions.template
Type: `String | Object`
Default: jasmine's default template

The template to mix-in coverage.

### templateOptions.templateOptions
Type: `Object`
Default: `undefined`

The options to pass to the mixed-in template.

## Sample Usage

### Basic

Have a look at [this example](https://github.com/maenu/grunt-template-jasmine-istanbul-example).

```js
// Example configuration
grunt.initConfig({
	jasmine: {
		coverage: {
			src: ['src/main/js/*.js'],
			options: {
				specs: ['src/test/js/*.js'],
				template: require('grunt-template-jasmine-istanbul'),
				templateOptions: {
					coverage: 'bin/coverage/coverage.json',
					report: 'bin/coverage',
				}
			}
		}
	}
}
```

### RequireJS

Have a look at [this example](https://github.com/maenu/grunt-template-jasmine-istanbul-example/tree/requirejs).
Note that you need to configure the `baseUrl` to point to the instrumented sources, as described in the section [below](https://github.com/maenu/grunt-template-jasmine-istanbul#a-single-requirement).

```js
grunt.initConfig({
    jasmine: {
        coverage: {
            src: ['src/main/js/*.js'],
            options: {
                specs: ['src/test/js/*.js'],
                template: require('grunt-template-jasmine-istanbul'),
                templateOptions: {
                    coverage: 'bin/coverage/coverage.json',
                    report: 'bin/coverage',
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfig: {
                            baseUrl: '.grunt/grunt-contrib-jasmine/src/main/js/'
                        }
                    }
                }
            }
        }
    }
}
```

## Mixed-in Templates

### The Idea

Do you have another template you want to use, but you also want to collect code coverage at the same time?
Then you can use a mixed-in template, that's what they are for.
The idea behind a mixed-in template is simple:
Istanbul generates code coverage information by instrumenting the sources before they are run and by generating reports after they have run.
Therefore this templates acts as a test pre- and post-processor, but it doesn't interfere with the actual running of the tests.
This makes it possible to use another template as a mix-in template to run the tests, defined by `templateOptions.template` and can be configured with `templateOptions.templateOptions`.

### A Single Requirement

A mixed-in template needs to load the instrumented sources in order for the coverage reports to be correctly generated.
This template copies instrumented versions of the sources to a temporary location at `.grunt/grunt-contrib-jasmine/`.
If your mixed-in template simply includes the sources, as the default template does, you don't need to account for that, since this template replaces the `src` option with the paths to the instrumented versions.
If your mixed-in template loads the sources differently, e.g. directly from the file system, you may need to reconfigure the mixed-in template.
