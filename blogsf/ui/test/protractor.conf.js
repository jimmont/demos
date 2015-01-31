/**
* end-to-end test config for protractor/selenium
*
* set environment variables to override config:
	export PROJECTO_UI_URL='http://localhost:10000/'
	export PROJECTO_UI_SELENIUM_ADDRESS='http://127.0.0.1:4444/wd/hub'
* 
* cd into project, install/setup/start
* start webdriver
* % npm run webdriver-start
* run the tests
* % npm run test-e2e
* a browser will open and you'll see the tests run (unless it's headless)
* 
* more info: 
* https://docs.angularjs.org/guide/e2e-testing
* https://github.com/angular/protractor/blob/master/docs/browser-setup.md
* https://github.com/angular/protractor/blob/master/docs/getting-started.md
* https://github.com/angular/protractor/blob/master/docs/debugging.md
* https://github.com/angular/protractor/blob/master/docs/faq.md
* https://github.com/angular/protractor/blob/master/docs/api.md
* http://www.ng-newsletter.com/posts/practical-protractor.html
* https://github.com/angular/protractor/issues/60
* https://github.com/angular/protractor/issues/232
* http://stackoverflow.com/questions/19391813/protractor-fails-to-find-angular/19568828#19568828
* https://github.com/angular/protractor/issues/122
* https://github.com/angular/protractor/blob/master/spec/login/login_spec.js
* https://github.com/angular/protractor/blob/master/spec/junitOutputConf.js
* https://github.com/angular/protractor/blob/master/spec/multiConf.js
* https://www.exratione.com/2013/12/angularjs-headless-end-to-end-testing-with-protractor-and-selenium/
* 
* for invalid or corrupt jar file see solution at:
* http://stackoverflow.com/questions/20680229/invalid-or-corrupt-jarfile-usr-local-bin-selenium-server-standalone-2-38-0-jar
*/
exports.config = {
  seleniumAddress: (process.env.PROJECTO_UI_SELENIUM_ADDRESS || 'http://127.0.0.1:4444/wd/hub').trim().replace(/\/+$/,''),
  allScriptsTimeout: 56789,
  specs: [ 'e2e.js' ],
  // see the browser-setup link above for BOTH capabilities and multiCapabilities
  capabilities: {browserName:'chrome'},
  /*
  // to test multiple browsers at once use multiCapabilities
  multiCapabilities: [
    ,{'browserName': 'chrome'}
    ,{'browserName': 'firefox'}
  ],
  */
  //default params
  params: {
  },
  suites: {
    full: ['e2e.js']
  },
  baseUrl: (process.env.PROJECTO_UI_URL || 'http://localhost:10001/').trim().replace(/\/+$/,'/'),
  framework: 'jasmine',
  jasmineNodeOpts: { defaultTimeoutInterval: 30000, showColors: true, isVerbose: true}
};

