'use strict';
angular.module('mosaic',[])
.run(function($rootScope){
	$rootScope.username = 'onlyinsf';'tranbachkhoa';
	$rootScope.isMobile = /ipad|iphone|mobile/i.test(navigator.userAgent);
})
.controller('mosaicCtl',function($scope, pinterest){
	$scope.loadProfile = function(){
		this.$root.username = this.username;
	}
})
.factory('popupSvs',function($rootScope){
	var doc = angular.element(document)
	,svs = {
		show: false
		,pin: {}
		,click: function(e){
			if(angular.element(e.target).scope().pin === svs.pin || e.target.offsetParent.nodeName === 'POPUP'){
				return;
			}
			$rootScope.$apply(function(){
				svs.show = false;
				doc.off('click', svs.click);
			});
		}
	};
	$rootScope.popupSvs = svs;
	$rootScope.$watch('popupSvs.pin',function(nu,old){
		if(!nu || !nu.images || nu === old || svs.show) return;
		svs.show = true;
		doc.on('click',svs.click);
	});
	return svs;
})
.directive('popup',function(){
	return {
		restrict: 'E'
		,controller: function($scope, popupSvs, pinterest){
			$scope.popupSvs = popupSvs;
			$scope.pinterest = pinterest();
			$scope.next = function(){
				this.popupSvs.i++;
				if(this.popupSvs.i >= this.pinterest.pins.length) this.popupSvs.i = 0;
				this.popupSvs.pin = this.pinterest.pins[ this.popupSvs.i ];
			}
			$scope.previous = function(){
				this.popupSvs.i--;
				if(this.popupSvs.i < 0) this.popupSvs.i = this.pinterest.pins.length - 1;
				this.popupSvs.pin = this.pinterest.pins[ this.popupSvs.i ];
			}
		}
	}
})
.directive('mosaic',function(pinterest, popupSvs){
	return {
		restrict: 'A'
		,controller: function($scope){
			$scope.pinterest = pinterest();
			$scope.next = function(){
				this.i++;
				if(this.i >= this.pinterest.pins.length) this.i = 0;
				this.pin = this.pinterest.pins[ this.i ];
			};
			$scope.previous = function(){
				this.i--;
				if(this.i < 0) this.i = this.pinterest.pins.length - 1;
				this.pin = this.pinterest.pins[ this.i ];
			}
		}
		,link:function(scope, elem, attrs, ctrl){
			scope.redraw = function(e){
//				if(this.pack) this.pack.layout();
			};
			scope.popup = function(){
				if(popupSvs.show){
				// hassle for touch devices
				// TODO
					popupSvs.show = false;
					return;
				};

				popupSvs.i = this.i;
				popupSvs.pin = this.pin;
				popupSvs.show = true;
			}
			scope.$watch('pinterest.pins',function(nu,old,scope){
			/*
				if(nu && nu.length && nu != old){
					scope.pack = new Packery(elem[0], {itemSelector: '.pin', gutter: 5});
				}
				*/
			});
		}
	};
})
.directive('imgLoad', function($parse){
	return {
		restrict: 'A'
		,link: function(scope, elem, attr){
			var fn = $parse(attr.imgLoad)
			function handler(e){
				scope.$apply(function apply(){
					fn(scope, {$event: e});
				});
			};
			elem.on('load', handler)
			scope.$on('$destroy',function cleanup(){
				elem.off('load', handler);
			});
		}
	};
})
.directive('rightClick',function($parse){
	return function(scope, elem, attr){
		var fn = $parse(attr.rightClick);
		elem.on('contextmenu',function(event){
			event.preventDefault();
			scope.$apply(function(){
				fn(scope, {$event: event});
			});
		});
	}
})
.factory('pinterest',function($http, $rootScope){
	var data = {}, req, Pinterest = function(){
		// http://www.pinterest.com/onlyinsf/
		var username = $rootScope.username
		,url = 'http://api.pinterest.com/v3/pidgets/users/'+username+'/pins/?callback=JSON_CALLBACK'
		url = '/pins.json?callback=JSON_CALLBACK'
		if(data.username != username){
			data.username = username;
			req = req || $http.jsonp(url,{})
			.success(function(res, status, hdr, config){
				var p, i, l;
				for(p in res.data){
					data[p] = res.data[p];
				};
				req = false;
			})
			.error(function(res, status, hdr, config){
				data.username = req = false;
			});
		};

		return data;
	};
	$rootScope.$watch('username',function(nu,old,scope){
		if(nu && nu != old) Pinterest();
	});
	return Pinterest;
});

angular.bootstrap(document,['mosaic']);
