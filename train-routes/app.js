#!/usr/bin/env node
/*
to run this code

1) install node http://nodejs.org/
	http://howtonode.org/how-to-install-nodejs

2) run the file from the command line
	% node app.js

	or
	% chmod +x app.js
	% ./app.js

	or with options
	% node app.js debug=true data=AB5,CD6
	% node app.js file=path/to/file

3) test the code
	% node test.js

	or chmod +x test.js
	% ./test.js

note)
	I am not a computer scientist. I just play one on TV.
	The original exercise can be found at the end of this file.

*/

var fs = require('fs')
	,data = '', i = 0, l = process.argv.length
	,debug = true;

while(i < l){
	data = process.argv[i++].match(/^.*(file|data|debug)=(.+)/);
	if(data && data[1] === 'debug'){
		debug = data[2] === 'true' ? true : false;
		continue;
	};
	if(data && data[2]){
		if(debug) console.log(data[1]+' given:',data[2]);
		if(data[1]==='file'){
			data = data[2];
			fs.stat(data, function(err, stat){
				if(err){ return console.error("couldn't find",data); }
				fs.readFile(data, 'utf8', function(err, content){
					if(err) return console.error("couldn't read",data);
					data = content;
					setup();
				});
			});
		}else{
			data = data[2];
			setup();
		};
		break;
	};
	data = '';
};
if(!data){
	setup();
}

function setup(){
	if(!data){
		console.error('\ndata required, either:');
		console.error('data=AB5,BC6 or file=path/to/file');
		console.error('data items delimited by any non-alphanumeric character(s)');
		console.error('eg: AB5, BC3');
		console.error('if provided as argument then the values should be comma-delimited');
		console.error('eg: data=AB5,BC3,CD1\n');

		process.exit(1);
	};
	var item, ok = /^[a-z]{2}[0-9]$/i, set = [], o = {};
	data = data.replace(/[^a-z0-9]+/gi,',').split(/,+/);
	while(item = data.shift()){
		if(debug) console.log('item:',item,ok.test(item));
		if(ok.test(item)){
			set.push(item);
			item = item.split('');
			o[item.slice(0,2).join('')] = {
				start: item[0]
				,end: item[1]
				,length: item[2]*1
			}
		}else if(debug) console.log('discard invalid:',item);
	};
	if(!set.length){
		console.error("\ncouldn't process the data provided\nexpected format is a series of 2 letters and a number\neg: AB5,BC6\n",set);
		process.exit(1);
	};
	if(debug) console.log('working with:',set);
	data = {
		list: set
		,hash: o
	}
	exercise();
};

function exercise(){
	if(debug) console.log(data);
	console.log(1,route('A-B-C'),'The distance of the route A-B-C.');
	console.log(2,route('A-D'),'The distance of the route A-D.');
	console.log(3,route('A-D-C'),'The distance of the route A-D-C.');
	console.log(4,route('A-E-B-C-D'),'The distance of the route A-E-B-C-D.');
	console.log(5,route('A-E-D'),'The distance of the route A-E-D.');
	console.log(6
		,routes('C','C',false,3).concat().length
		,'The number of trips starting at C and ending at C with a maximum of 3 stops.  In the sample data below, there are two such trips: C-D-C (2 stops). and C-E-B-C (3 stops).'
	);
	console.log(7
		, routes('A','C',false,4).concat().filter(function(v,i,a){ return v.stops === 5; }).length
		,'The number of trips starting at A and ending at C with exactly 4 stops.  In the sample data below, there are three such trips: A to C (via B,C,D); A to C (via D,C,D); and A to C (via D,E,B).'
	);
	console.log(8
		,(routes('A','C',true).concat().sort(function(a,b){
			var a = a.distance - b.distance
			return a < 0 ? -1 : ( a >  0 ? 1 : 0 );
		})[0] || {}).distance
		,'The length of the shortest route (in terms of distance to travel) from A to C.'
	);
	console.log(9
		,(routes('B','B').sort(function(a,b){
			var a = a.distance - b.distance
			return a < 0 ? -1 : ( a >  0 ? 1 : 0 );
		})[0] || {}).distance
		,'The length of the shortest route (in terms of distance to travel) from B to B.'
	);
	console.log(10
		,routes('C','C',false,30).concat().filter(function(v,i,a){
			return v.distance < 30;
		}).length
		,'The number of different routes from C to C with a distance of less than 30.  In the sample data, the trips are: CDC, CEBC, CEBCDC, CDCEBC, CDEBC, CEBCEBC, CEBCEBCEBC.'
	);
}

function route(points){
	// for the given points 'A-B-C'
	// return the length if the route exists
	// otherwise return 'NO SUCH ROUTE'
	points = points.replace(/[^a-z]+/gi,'').split('');
	var result = [], pt, leg, length = 0, i, l;
	for(i=0,l = points.length - 1;i<l;i++){
		leg = data.hash[points[i]+points[i+1]];
		if(!leg){
			length = 0;
			result = 'NO SUCH ROUTE';
			break;
		}
		length += leg.length;
		result.push(points[i]);
	};
	
	return length ? length : result;
}

function routes(start, end, nolooping, max, str, result, set){
	// find all the routes in the set where it's possible to go from start to end
	// return an array with all the possible routes
	var leg, name;
	result = result || [];
	str = (str || '') + start;
	nolooping = nolooping || false;
	set = set || JSON.parse(JSON.stringify(data.hash));
	// max number of stops
	max = max || 20;
	if(str.length > max) return result;
	for(name in set){
		leg = set[name];
		if(leg.start === start){
			if(leg.end === end && !result[str+end]){
				leg = str + end;
				result[leg] = 1;
				result.push({
					route: leg
					,stops: leg.length
					,distance: route(leg)
				});
				if(!nolooping) routes(end, end, nolooping, max, str, result, set);
			} else routes(leg.end, end, nolooping, max, str, result, set);
		};
	};
	return result;
}

/*
INTRODUCTION TO THE PROBLEMS

•	There must be a way to supply the application with the input data via text file
•	The application must run
•	You should provide sufficient evidence that your solution is complete by, as a minimum, indicating that it works correctly against the supplied test data

PROBLEM ONE: TRAINS

The local commuter railroad services a number of towns in Kiwiland.  Because of monetary concerns, all of the tracks are 'one-way.'  That is, a route from Kaitaia to Invercargill does not imply the existence of a route from Invercargill to Kaitaia.  In fact, even if both of these routes do happen to exist, they are distinct and are not necessarily the same distance!

The purpose of this problem is to help the railroad provide its customers with information about the routes.  In particular, you will compute the distance along a certain route, the number of different routes between two towns, and the shortest route between two towns.

Input:  A directed graph where a node represents a town and an edge represents a route between two towns.  The weighting of the edge represents the distance between the two towns.  A given route will never appear more than once, and for a given route, the starting and ending town will not be the same town.

Output: For test input 1 through 5, if no such route exists, output 'NO SUCH ROUTE'.  Otherwise, follow the route as given; do not make any extra stops!  For example, the first problem means to start at city A, then travel directly to city B (a distance of 5), then directly to city C (a distance of 4).

1. The distance of the route A-B-C.
2. The distance of the route A-D.
3. The distance of the route A-D-C.
4. The distance of the route A-E-B-C-D.
5. The distance of the route A-E-D.
6. The number of trips starting at C and ending at C with a maximum of 3 stops.  In the sample data below, there are two such trips: C-D-C (2 stops). and C-E-B-C (3 stops).
7. The number of trips starting at A and ending at C with exactly 4 stops.  In the sample data below, there are three such trips: A to C (via B,C,D); A to C (via D,C,D); and A to C (via D,E,B).
8. The length of the shortest route (in terms of distance to travel) from A to C.
9. The length of the shortest route (in terms of distance to travel) from B to B.
10.The number of different routes from C to C with a distance of less than 30.  In the sample data, the trips are: CDC, CEBC, CEBCDC, CDCEBC, CDEBC, CEBCEBC, CEBCEBCEBC.

Test Input:
For the test input, the towns are named using the first few letters of the alphabet from A to D.  A route between two towns (A to B) with a distance of 5 is represented as AB5.
Graph: AB5, BC4, CD8, DC8, DE6, AD5, CE2, EB3, AE7
Expected Output:
Output #1: 9
Output #2: 5
Output #3: 13
Output #4: 22
Output #5: NO SUCH ROUTE
Output #6: 2
Output #7: 3
Output #8: 9
Output #9: 9
Output #10: 7
*/
