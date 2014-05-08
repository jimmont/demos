/* vim: syntax=off
*/
angular.module('mocks',['ngMockE2E'])
.run(function($httpBackend) {
	$httpBackend
	.whenGET(/\/api\/.+/)
	.respond(function(method, url, data, headers) {
		var part = url.match(/\/api\/([^\/]+)[\/?]*([^\/?])?/);

		switch(part[1]){
		case 'an-example': 
			data = {a:'javascript object here'};
			break;

		case 'main':
			data = [

			];
			break;
			case 'detail': 
switch(+part[2]){ // by index
case 0:
data = [
// detail...
	{img:'the-image.extension',header:'The Header',subhead:'"Whodunit"',blurb:"NEW Lorum ipsum."}
];
break;
default:
data = [
	{img:'path/to/image',header:'Header',subhead:'Sub Head',blurb:"Blurb."}
	,{img:'path/to/image',header:'Header',subhead:'Sub Head',blurb:"Blurb."}
];
};
			break;
			default:
		}; // case
		
		return [200, data, {}];
		//	: [401, {error:'not authorized'}, {}]
		}, function(method, url, data){
		// TODO handle error case
		return [404, ({error:'not found'}), {}];
	});
});
