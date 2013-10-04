#!/usr/bin/env node

var assert = require('assert')
	,pass = 0
	,fail = 0
	,exec = require('child_process').exec;

	exec('node app.js debug=false file=this/does/not/exist',function(err, stdout, stderr){
		testit(/couldn\'t find this/.test(stderr), true, 'should tell when it cannot find a file');
	});
	exec('node app.js debug=false data=YZ5',function(err, stdout, stderr){
		testit(err, null, 'should not error with bad data');
	});
/*
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
	exec('node app.js debug=false data=AB5,BC4,CD8,DC8,DE6,AD5,CE2,EB3,AE7', function(err, stout, sterr){
			var results = stout.split(/\r?\n/)
				,i = 0
				,item
				,expected = ['1 9', '2 5', '3 13', '4 22', '5 \'NO SUCH ROUTE\'', '6 2', '7 3', '8 9', '9 9', '10 7']
			while(item = results[i]){
				testit(item.indexOf( expected[i] + ' '), 0, item +' should start with the value '+expected[i]);
				i++;
			};
			testit(i,10,'there should be 10 items');
	});

	function testit(a, b, msg){
		try{
			assert.equal(a, b);
			console.log('pass',msg);
			pass++;
		}catch(err){
			console.error('FAIL',msg);
			fail++;
		};
	};
	process.on('exit',function(){
		var total = pass + fail;
		console.log('passed:',pass,Math.round(pass/total * 100)+'%');
		console.log('failed:',fail,Math.round(fail/total*100)+'%');
	});
