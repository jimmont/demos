/*
https://github.com/angular/protractor/blob/master/docs/browser-setup.md
https://github.com/angular/protractor/blob/master/docs/getting-started.md
https://github.com/angular/protractor/blob/master/docs/debugging.md
https://github.com/angular/protractor/blob/master/docs/faq.md
http://www.ng-newsletter.com/posts/practical-protractor.html
https://github.com/angular/protractor/issues/60
https://github.com/angular/protractor/issues/232
http://stackoverflow.com/questions/19391813/protractor-fails-to-find-angular/19568828#19568828
https://github.com/angular/protractor/issues/122
https://github.com/angular/protractor/blob/master/spec/login/login_spec.js
https://github.com/angular/protractor/blob/master/spec/junitOutputConf.js
https://github.com/angular/protractor/blob/master/spec/multiConf.js
https://www.exratione.com/2013/12/angularjs-headless-end-to-end-testing-with-protractor-and-selenium/
*/
exports.config = {
  seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
  allScriptsTimeout: 30123,
  //specs: [ 'e2e/*.js' ],
  specs: [ 'e2e/scenarios.js' ],
  // see the browser-setup link above for BOTH capabilities and multiCapabilities
  //capabilities: {browserName:'phantomjs'},
  capabilities: {browserName:'chrome'},
  /*
  capabilities: {
	  browserName: 'phantomjs'
	  ,'phantomjs.binary.path':'./node_modules/phantomjs/bin/phantomjs'
	  //Acceptable cli arugments: https://github.com/ariya/phantomjs/wiki/API-Reference#wiki-command-line-options
	  //,'phantomjs.cli.args':['--logfile=PATH', '--loglevel=DEBUG']
  },
  */
  // to test multiple browsers at once use multiCapabilities
  // to test multiple browsers at once use multiCapabilities
/*
  multiCapabilities: [
  	{'browserName': 'phantomjs'}
  	,{'browserName': 'chrome'}
  	,{'browserName': 'firefox'}
  ],
*/
  baseUrl: 'http://localhost:3000/',
  framework: 'jasmine',
  onPrepare: function() {
    // The require statement must be down here, since jasmine-reporters
    // needs jasmine to be in the global and protractor does not guarantee
    // this until inside the onPrepare function.
    require('jasmine-reporters');
    browser.getCapabilities().then(function(caps){
    		caps = caps.caps_;
		caps = "e2e-" +
			caps.browserName + '-' +
			caps.version + '-';
		jasmine.getEnv().addReporter(
			new jasmine.JUnitXmlReporter("app/test-coverage/", true, true, caps)
		);
    });
  },
  jasmineNodeOpts: { defaultTimeoutInterval: 30000, showColors: true }
};
