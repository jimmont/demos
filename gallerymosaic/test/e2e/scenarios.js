'use strict';
// https://github.com/angular/protractor/blob/master/docs/api.md
// https://github.com/angular/protractor/blob/master/docs/debugging.md
describe('product UI', function() {
	var ptor;//, projectPage = require('./projectPage.js');
	beforeEach(function(){
		// projectPage.home();
		browser.get('/');
		ptor = protractor.getInstance();
	},30000);

	it('should show a 404 error on unknown pages (regardless of login state)',function(){
		var url = '/404-'+((new Date).getTime());
		ptor.manage().deleteAllCookies();
		browser.get(url);
		$$('.content').first().getText().then(function(txt){
			expect(txt).toBe("Sorry, couldn't find "+url);
		});
	});

	it('login should work', function(){
		ptor.manage().deleteAllCookies();
		browser.driver.executeScript(function(){
			return angular.element(document).scope().user;
		}).then(function(user){
			expect(!!user.isLoggedIn).toBe(false);
		});
		$('.loginForm input[type="email"]').sendKeys('asdf@asdf.com')
		$('.loginForm input[type="password"]').sendKeys('asdf')
		$('.loginForm input[type="submit"]').click()
		browser.driver.executeScript(function(){
			return angular.element(document).scope().user;
		}).then(function(user){
			expect(user.isLoggedIn).toBe(true);
		});
	});
	it('expecting..',function(){
		expect(1+1).toBe(2);
	});
/*
var fs = require('fs');
function screenshot(d, file){
	var s = fs.createWriteStream(file);
	s.write(new Buffer(d,'base64'));
	s.end();
}
	it('should...',function(){
browser.get('/');
ptor.waitForAngular();
var b;
console.log('you are here:',b=browser.getLocationAbsUrl());
b.then(function(){ console.log('args>',arguments); });
browser.sleep(1000);
b.then(function(v){
	console.log('v>>',v);});

		expect(1).toBe(1);
	});
/*
	it('logout should work', function(){
		browser.get('/');
		$('body').click();

		expect(true).toBe(true);
//		$('[ng-click="logout()"]').click();
//		$('.ff-unlock,.ff-lock').click();
/*
		browser.driver.executeScript(function(){
			return angular.element(document).scope().user;
		}).then(function(user){
			expect(user.isLoggedIn).toBe(true);
		});
*/
/*
browser.takeScreenshot().then(function (png) {
    writeScreenShot(png, 'logout.png');
});
		browser.driver.executeScript(function(){
console.log('user 1of2>>',arguments);
			return angular.element(document).scope().user;
		}).then(function(user){
console.log('user>>',user);
//			expect(!!user.isLoggedIn).toBe(false);
		});
*/
/*
browser.getLocationAbsUrl().then(function(v){console.log('v>>',v);});

	it('should automatically redirect to /view1 when location hash/fragment is empty', function() {
		expect(browser.getLocationAbsUrl()).toMatch("/view1");
	});
	describe('view1', function() {
		beforeEach(function() {
			browser.get('index.html#/view1');
		});
		it('should render view1 when user navigates to /view1', function() {
			expect(element.all(by.css('[ng-view] p')).first().getText()).
				toMatch(/partial for view 1/);
		});
	});
	describe('view2', function() {
		beforeEach(function() {
			browser.get('index.html#/view2');
		});
		it('should render view2 when user navigates to /view2', function() {
			expect(element.all(by.css('[ng-view] p')).first().getText()).
				toMatch(/partial for view 2/);
		});
	});
*/
});
