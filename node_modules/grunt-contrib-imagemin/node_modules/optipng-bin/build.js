'use strict';
var exec = require('child_process').exec;
var path = require('path');
var which = require('which');
var colors = require('colors');
var binPath = require('./lib/optipng-bin.js').path;


module.exports = function () {
	if (process.platform === 'darwin' || process.platform === 'linux') {
		which('make', function (err) {
			if (err) {
				return console.log(err);
			}

			var binDir = path.dirname(binPath);
			var buildScript = 'make clean &&' +
							  './configure --with-system-zlib --bindir=' + binDir  + ' --mandir=man && ' +
							  'make install';
			exec(buildScript, { cwd: './optipng/' }, function (err) {
				if (err) {
					return console.log(err.red);
				}

				console.log('OptiPNG rebuilt successfully'.green);
			});
		});
	}
};
