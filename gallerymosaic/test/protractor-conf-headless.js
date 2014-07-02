/* see protractor-conf.js for comments, etc
all details here are the same or similar except capabilities.browserName = phantomjs
so that the e2e tests can run (in headless browsers) in the Jenkins environment
*/
exports.config = {
  allScriptsTimeout: 30123,
  specs: [ 'e2e/*.js' ],
  capabilities: {
	  browserName: 'phantomjs'
	  ,'phantomjs.binary.path':'./node_modules/phantomjs/bin/phantomjs'
  },
  baseUrl: 'http://localhost:3000/',
  framework: 'jasmine',
  onPrepare: function() {
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
  jasmineNodeOpts: { defaultTimeoutInterval: 30000 }
};
