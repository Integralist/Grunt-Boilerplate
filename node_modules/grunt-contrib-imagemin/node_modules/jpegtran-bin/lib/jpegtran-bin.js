var path = require('path');

if (process.platform === 'darwin') {
	exports.path = path.join(__dirname, '../vendor/osx', 'jpegtran');
} else if (process.platform === 'linux') {
	exports.path = path.join(__dirname, '../vendor/linux', 'jpegtran');
} else if (process.platform === 'win32') {
	if (process.arch === 'x64') {
		exports.path = path.join(__dirname, '../vendor/win64', 'jpegtran.exe');
	} else {
		exports.path = path.join(__dirname, '../vendor/win32', 'jpegtran.exe');
	}
} else {
	console.log('Unsupported platform:', process.platform, process.arch);
}
