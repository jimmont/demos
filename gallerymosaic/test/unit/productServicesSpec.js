describe("the product services which call the various api's", function(){
	describe("productAuth service", function(){
		beforeEach(function(){
			module('productServices');
		});
		/*

		var productAuth, $httpBackend, $rootScope, createController;
		beforeEach(inject(function($injector){
			productAuth = $injector.get('productAuth');
			$httpBackend = $injector.get('$httpBackend');
			$rootScope = $injector.get('$rootScope');

			$httpBackend.whenGET('auth/login').respond(405, {error:'Method Not Allowed'});
			$httpBackend.whenPOST('auth/logout-incorrect-password').respond(401, {error:'Invalid Password'});
			$httpBackend.whenPOST('auth/login').respond(200, {user: 'bill@product.com'}, {'A-HEADER': 'xxx'});
			$httpBackend.whenPOST('auth/logout-fails').respond(401, {error:'TODO'});
			$httpBackend.whenPOST('auth/logout').respond(200, {user: 'bill@product.com'}, {'A-HEADER': 'xxx'});
		}));
		afterEach(function() {
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		});
		it('should have the expected methods', function(){
			expect(angular.isFunction(productAuth.login)).toBe(true);
			expect(angular.isFunction(productAuth.logout)).toBe(true);
			expect(angular.isFunction(productAuth.user)).toBe(true);
			expect(angular.isFunction(productAuth.isLoggedIn)).toBe(true);
		});
/*
// TODO
		it('login and logout should TODO', function(){
			$httpBackend.expectGET('auth/login');
			var controller = createController();
			$httpBackend.flush();
		});

*/
	});
/*
   it('should fetch authentication token', function() {
   });
 
 
   it('should send msg to server', function() {
     var controller = createController();
     $httpBackend.flush();
 
     // now you don’t care about the authentication, but
     // the controller will still send the request and
     // $httpBackend will respond without you having to
     // specify the expectation and response for this request
 
     $httpBackend.expectPOST('/add-msg.py', 'message content').respond(201, '');
     $rootScope.saveMessage('message content');
     expect($rootScope.status).toBe('Saving...');
     $httpBackend.flush();
     expect($rootScope.status).toBe('');
   });
 
 
   it('should send auth header', function() {
     var controller = createController();
     $httpBackend.flush();
 
     $httpBackend.expectPOST('/add-msg.py', undefined, function(headers) {
       // check if the header was send, if it wasn't the expectation won't
       // match the request and the test will fail
       return headers['Authorization'] == 'xxx';
     }).respond(201, '');
 
     $rootScope.saveMessage('whatever');
     $httpBackend.flush();
   });
*/
});
