
"use strict";

var template = __dirname + '/templates/jasmine-requirejs.html',
    requirejs  = {
      '2.1.1' : __dirname + '/../vendor/require-2.1.1.js',
      '2.1.2' : __dirname + '/../vendor/require-2.1.1.js'
    };

exports.process = function(grunt, task, context) {

  var version = context.options.version;

  // find the latest version if none given
  if (!version) {
    version = Object.keys(requirejs).sort().pop();
  }

  var src = context.scripts.src;
  var baseUrl = context.options.requireConfig && context.options.requireConfig.baseUrl;
  if (!baseUrl) {
    baseUrl = '/';
  }

  // Remove baseUrl and .js from src files
  src.forEach(function(script, i){
    if (baseUrl) {
      script = script.replace(new RegExp('^' + baseUrl),"");
    }
    src[i] = script.replace(/\.js$/,"");
  });

  // Prepend loaderPlugins to the appropriate files
  if (context.options.loaderPlugin) {
    Object.keys(context.options.loaderPlugin).forEach(function(type){
      if (context[type]) {
        context[type].forEach(function(file,i){
          context[type][i] = context.options.loaderPlugin[type] + '!' + file;
        });
      }
    });
  }

  task.copyTempFile(requirejs[version],'require.js');

  var source = grunt.file.read(template);
  return grunt.util._.template(source, context);
};

