module.exports = function(config) {
	var jsFiles = require('../../package.json').ui_js_files;
	// set NODE_ENV appropriately (test/develop/production)
	var settings = {
		// base path, that will be used to resolve files and exclude
		basePath: '../',
		frameworks: ['jasmine'],
		files: 
			jsFiles.libs
			.concat( jsFiles.app )
			.concat( jsFiles.mocks )
			.concat( jsFiles.unit )
		,exclude: [ ],
		// possible reporters: 'dots', 'progress', 'junit', 'growl', 'coverage'
		reporters: ['progress', 'coverage', 'dots', 'junit'],
		preprocessors: {
			// source files, that you wanna generate coverage for
			// do not include tests or libraries
			// (these files will be instrumented by Istanbul)
			// html 2 js converter for directive templates
			// NOTE disable when debugging tests as coverage has bugs that effectively turn off stack traces
			,'js/*.js':['coverage']
		},
		ngHtml2JsPreprocessor: {
				stripPrefix: ''
				,moduleName: 'templates'
		},
		// optionally, configure the reporter
		coverageReporter: {
			type: 'html'
			,dir: 'test/coverage/'
		},
		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,
		autoWatch: true,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		browsers: ['Chrome'],

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 60000,
		plugins: [
				'karma-coverage',
				'karma-chrome-launcher',
				'karma-firefox-launcher',
				'karma-jasmine',
				'karma-junit-reporter'
		],
		singleRun: false,
		junitReporter : {
		// recommended per http://karma-runner.github.io/0.12/plus/jenkins.html
			outputFile: 'test/coverage/junit-report-chrome.xml'
			,suite: 'unit'
		}
	}; // default settings

	// NODE_ENV === 'test', CI, drone and other test environment overrides here:
	if(/^test$/i.test(process.env.NODE_ENV)){
		settings.customLaunchers = {
			'chrome': {
				base: 'WebDriver',
				config: {
					hostname: '0.0.0.0', // drone uses webdriver service which is local
					port: 4444,
					user: 'username',
					pwd: 'xyz'
				},
				browserName: 'chrome',
				platform: 'ANY',
				name: 'Karma'
			}
		};
		settings.runnerPort = 1234;
		try{
			settings.hostname = require("os").networkInterfaces().eth0[0].address;
		}catch(err){ };
		settings.singleRun = true;
		settings.browsers = ['chrome'];
		settings.plugins = [
				'karma-webdriver-launcher',
				'karma-coverage',
				'karma-jasmine',
				'karma-junit-reporter'
		];
	}; // NODE_ENV === 'test'

	config.set( settings );
};
