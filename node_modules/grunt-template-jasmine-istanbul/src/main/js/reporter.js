(function () {
	var reporter = new jasmine.Reporter();
	reporter.reportRunnerResults = function (runner) {
		phantom.sendMessage('jasmine.coverage', __coverage__);
	};
	jasmine.getEnv().addReporter(reporter);
})();