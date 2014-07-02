module.exports = function(config){
    config.set({
    basePath : '../',

    files : [
      'app/js/ng/angular.js',
//      'app/js/ng/angular-*.js',
      'test/lib/angular/angular-mocks.js',
//      'app/js/packery.js',
      'test/unit/**/*.js'
    ],
    // junit and dots recommended per karma-runner Jenkins CI instructions (link below)
    reporters: ['progress', 'coverage', 'dots', 'junit'],
    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'app/js/app.js': ['coverage'],
    //  'app/js/project*.js': ['coverage']
    },
    // optionally, configure the reporter
    coverageReporter: {
      type : 'html',
      dir : 'app/test-coverage/'
    },
    exclude : [
      'app/js/ng/angular-loader.js',
      'app/js/ng/*.min.js',
      'app/js/ng/angular-scenario.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['PhantomJS','Chrome'],
    /*
    customLaunchers: {
      'PhantomJS_custom': {
        base: 'PhantomJS',
        options: {
          windowName: 'my-window',
          settings: {
            webSecurityEnabled: false
          }
        },
        flags: ['--remote-debugger-port=9000']
      }
    */

    plugins : [
            'karma-junit-reporter',
            'karma-coverage',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
             'karma-phantomjs-launcher',
             'karma-ie-launcher'
            ],

//    singleRun: true,
    junitReporter : {
	 // recommended per http://karma-runner.github.io/0.12/plus/jenkins.html
      outputFile: 'app/test-coverage/junit-report.xml',
      suite: 'unit'
    }
})}
