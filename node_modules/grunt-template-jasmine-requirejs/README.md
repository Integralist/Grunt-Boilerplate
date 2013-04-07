RequireJS template for Jasmine unit tests
-----------------------------------------

## Installation

```
npm install grunt-template-jasmine-requirejs --save-dev
```

## Template Options

### templateOptions.version
Type: `String`
Options: `2.1.1` `2.1.2`
Default: latest requirejs version included

The version of requirejs to use. Since this template is relatively recent, only versions 2.1.1 and 2.1.2 are

### templateOptions.requireConfig
Type: `Object`

This object is `JSON.stringify()`-ed into the template and passed into `require.config()`



## Sample usage

```js
// Example configuration
grunt.initConfig({
  connect: {
    test : {
      port : 8000
    }
  }
  jasmine: {
    taskName: {
      src: 'src/**/*.js',
      options: {
        specs: 'spec/*Spec.js',
        helpers: 'spec/*Helper.js',
        host: 'http://127.0.0.1:8000/',
        template: require('grunt-template-jasmine-requirejs'),
        templateOptions: {
          requireConfig: {
            baseUrl: 'src/'
          }
        }
      }
    }
  }
}
```

*Note* the usage of the 'connect' task configuration. You will need to use a task like
[grunt-contrib-connect][] if you need to test your tasks on a running server.

[grunt-contrib-connect]: https://github.com/gruntjs/grunt-contrib-connect

## RequireJS notes

If you end up using this template, it's worth looking at the
[source]() in order to familiarize yourself with how it loads your files. The load process
consists of a series of nested `require` blocks, incrementally loading your source and specs:

```js
require([*YOUR SOURCE*], function() {
  require([*YOUR SPECS*], function() {
    require([*GRUNT-CONTRIB-JASMINE FILES*], function() {
      // at this point your tests are already running.
    }
  }
}
```
