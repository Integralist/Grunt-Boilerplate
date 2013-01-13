var path = require('path');

if (process.platform === 'darwin') {
	exports.path = path.join(__dirname, '../vendor/osx', 'optipng');
} else if (process.platform === 'linux') {
	exports.path = path.join(__dirname, '../vendor/linux', 'optipng');
} else if (process.platform === 'win32') {
	exports.path = path.join(__dirname, '../vendor/win32', 'optipng.exe');
} else {
	console.log('Unsupported platform:', process.platform, process.arch);
}
