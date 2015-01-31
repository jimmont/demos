'use strict';
angular.module('blogsf', 
	((blogsf.mock ? 'mock, ':'')+'ngRoute').split(/,\s*/)
)
.run(function($templateCache, $rootScope, $window){
	// NOTE invalid templates end up loading the original document (index.html) which has the loading message.
	$rootScope.windowWidth = $window.innerWidth;
	angular.element($window).on('resize',function(e){
		$rootScope.windowWidth = $window.innerWidth;
//		$rootScope.$apply('windowWidth');
	});
	// resize usage: $rootScope.$watch('windowWidth',function(newVal, oldVal){ ... });
	var path, template = {
		// pieces and parts
		"404.html": "<p>Sorry, couldn't find <a href='{{url}}'><code>{{url}}</code></a></p>"	
		//util
		,"params.html":"<h1>params</h1><div ng-repeat='(key, val) in params'>{{key}}:{{val}}</div>"
	};
	for(path in template) $templateCache.put(path, template[path]);
})
.config(function($provide, $locationProvider, $routeProvider){
	$locationProvider.html5Mode(true);

	var routes = $provide.value('routes', {
	blog: {
	templateUrl: 'app.html'
	,controller: function($scope, $rootScope, $routeParams, $location){
		var query = ($routeParams.query || '').split('/');
		var section = $routeParams.section || [];
		$scope.currentLocation = $location.path().split('/')[1]
		$scope.params = $routeParams;
		$scope.params.view = section[0] || '';
		$scope.content = ['blog.html'];
	}}

	}).$get();

	$routeProvider
	.when('/', routes.blog)
	.when('/:query*', routes.blog)
	.otherwise({templateUrl:'app.html', controller: function($scope){
			$scope.url = location.pathname + location.search + location.hash;
			$scope.params = {view: '404'};
			$scope.content = ['404.html'];
		}
	})
})
.directive('panel', function(){
	return {
		restrict: 'E'
		,scope:{title:'@', expandable:'=?'}
		,transclude:true
		,replace:true
		,template:"<div class='panel' ng-class=''><header class='notSelectable panelHeader'><h3>{{title}}</h3> <i ng-if='expandable' ng-class='{true:\"ff-contract\",false:\"ff-expand\"}[expanded]' class='ff panelIcon' ng-click='toggleExpanded()'> </i></header><div class='panel-content' ng-transclude></div></div>"
		,controller: function($scope){

			if('boolean' != typeof($scope.expandable)) $scope.expandable = true;

			$scope.expanded = $scope.expanded || false;
			if(!$scope.expandable) return;

			$scope.toggleExpanded = function(){
			};
		}
		,link: function(scope, elem, attrs, ctrl){
			elem = elem[0];
			elem.removeAttribute('title');
			elem.classList.add('_panel-'+scope.title.replace(/[^a-z0-9_]/gi, '-').toLowerCase() );
		}
	}
})
.directive('onReady',function(){
	return {
		restrict: 'A'
		,link: function(scope, element, attrs){
			if(scope.$last) scope.$emit('ready');
		}
	}
})
.directive('blogShared',function(){
	return {
		restrict: 'A'
		,scope: true
		,controller: function($scope){
			$scope.shared = {};
		}
	}
})
.factory('api', function($http){
	var uuid = '2f7c8395-e82b-46f3-814c-25818ef9cd4a'
		,base = 'http://ui­blog.herokuapp.com/Blog/api/'
		;
	return {
	/** blog api

	 * 200 = SUCCESS
	 * 400 = FAIL

	 * get all
	 * GET http://ui­blog.herokuapp.com/Blog/api/?uuid=<uuid>
	 * JSON {blog: {posts: [{id: 123, text: '', title:'', timestampe:'<timefmt>'}, post, post...]}

	 * get post
	 * GET http://ui­blog.herokuapp.com/Blog/api/<id>?uuid=<uuid>
	 * JSON {post: {id: 123, text: '', title:'', timestampe:'<timefmt>'}}

	 * create post
	 * POST http://ui­blog.herokuapp.com/Blog/api/?uuid=<uuid>
	 * params{ title: <title>, text: <text> }

	 * update post
	 * POST http://ui­blog.herokuapp.com/Blog/api/<id>?uuid=<uuid>
	 * params{ title: <title>, text: <text> }

	 * delete post
	 * POST http://ui­blog.herokuapp.com/Blog/api/<id>?uuid=<uuid>
	 * params{ operation: delete }

	 * delete all
	 * DELETE http://ui­blog.herokuapp.com/Blog/api/?uuid=<uuid>

	 */
	 route: function(id){
	 	return base + (id ? (id + '/') : '');
	 }
	 ,fn: function(){}
	};
})
;
