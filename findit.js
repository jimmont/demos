#!/usr/bin/env node

console.time('time');
var sys = require('sys'),
    fs = require('fs');

var options = {
	'-p': {name:'pattern',info:'pattern', is:false, set: function(){ this.is = true; }},
	'-pattern': '-p',
	'-r':{name:'recursive',info:'recursive', is:false, set: function(){ this.is = true; }},
	'-recursive': '-r',
	'-c':{name:'casesensitive',info:'case-sensitive', is:false, set: function(){ this.is = !this.is; }},
	'-i':'-c',
	'-case-sensitive':'-c',
	'-x':{name:'exclude',info:'exclude-path, NOTE this is a regex', is:false, set: function(o){ if(!o) return; this.is = o; }}, // any bit in path to ignore, for multiple items delimit with a regex (eg pdf|xml|blah)
	'-exclude': '-x',
	'-d':{name:'dir',info:'base-path', is:false, set: function(o){ if(!o) return; this.is = o; }}, // false = pwd
	'-directory': '-d',
	'-v':{name:'verbose',info:'verbose-debug-mode', is:false, set: function(){ this.is = true; }},
	'-verbose': '-v',
	'-search':{name:'search',info:'search-string-or-pattern', is:'', set: function(o){ this.is = o;  }},
	'-s': '-search',
	'-depth':{name:'depth',info:'how many directories/levels to drill into', is:0, set: function(o){ if(isNaN(o)) return; this.is = o; }},
	'-n':'-depth'
};

function setOptions(cmd_list){
	var cmd, item, i=0, l = process.argv.length, cmd_, dashes = /^-+/;
	while(item = process.argv[i++]){
		// options are prefixed with -
		item = item.replace(dashes,'-');
		if(item.indexOf('-') == 0){
			cmd = item;
			cmd_ = cmd_list[cmd] || false;
			if(cmd_ && typeof cmd_ == 'string') cmd_ = cmd_list[cmd_];

			if(cmd_){
				cmd_.set.call(cmd_, item);
				if(options['-v'].is) console.log(item, 'option',cmd_.name);
			}else
				if(options['-v'].is) console.log('unknown', item, 'option');
	
		}else if(cmd){
			cmd_ = cmd_list[cmd] || false;
			if(cmd_){
// TODO when using a reference this can throw an error
				if(options['-v'].is) console.log('option "'.concat(cmd_.name, '" modified by "', item, '"'));
				cmd_.set(item);
			}else{
				if(options['-v'].is) console.log('unknown '.concat(cmd, ' modified by "', item, '" (not sure what to do with it)'));
			}
	
		}else if(options['-v'].is) console.log(i,item);
	}
	options.depth = parseInt(options['-depth'].is, 10);
	options.casesensitive = options['-c'].is;
	options.regex = options['-p'].is;
	options.exclude = options['-x'].is;
	if(options.exclude) options.exclude = new RegExp(options.exclude, 'gi');
	if(!options['-search'].is) options['-search'].set(process.argv[process.argv.length-1]);
	options.search = options['-search'].is;
	if(options.regex){
		options.search = new RegExp(options.search.replace(/\\/g, "\\$&"), 'g'.concat(options.casesensitive?'':'i'));
	}else{ // search string not a regex
		options.search = new RegExp(options.search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'g'.concat(options.casesensitive?'':'i'));
	}
	options.verbose = options['-v'].is;
	options.recursive = options['-r'].is;
	if(!options.recursive && options.depth) options.recursive = true;
	if(!options['-d'].is) options['-d'].set(process.cwd());
	else process.chdir(options['-d'].is);
	options.dir = options['-d'].is;
	if(options.depth) options.depth = options.dir.match(/\//g).length + options.depth;
return cmd_list;
}; // setOptions

process.on('exit',function(){
	console.timeEnd('time');
});
function exit(){
// SIGINT
	console.log('Exiting!');
	process.exit(0);
};
process.on('SIGINT', exit);
function lookInDirectory(path){
	// look at dir for files
	if(options.depth && path.match(/\//g).length > options.depth) return;
	fs.readdir(path, function (err,files){
		var _path = path.concat('/')
		if(err) return;// console.log("can't open:",_path);
		if(!files) return;
		files.forEach(function(f){
			var file = _path + f;
			// very likely binary?
			if(/\.(pdf|flv|swf|mp4|mp3|vob|png|bmp|jpg|jpeg|ico|gif|bin|gz|tgz|zip|tar|ai|psd|chk)$/i.test(f)) return;
			if(options.exclude && options.exclude.test(f)) return;
			fs.stat(file, function(err,stat){
				if(err || !stat) return;

				if(stat.isFile()){
  					fs.open(file,'r',function(err, fd){
						if(err) return;
						var len = 100;
						var buf = new Buffer(len);
						var re = /[.a-z0-9(){}\[\]? "':;<>?\s\n\r\t "':;#@~$%*<>.,_=+-]/ig;
						fs.read(fd,buf,0,len,0,function(err,num,buf){
							if(err || num < 1) return;
							var str = buf.toString('utf-8',0,num);
							// do we have enough of the types of characters typical of a text file?
							var charCount = (str.match(re) || []).length;
							if(charCount/num > 0.6){
							// probably a text file
							fs.readFile(file,'utf8',function(err,data){
								if(err) return;
								var results = data.match(options.search);
								if(results){
									console.log('found in (', (charCount/num), ')',file,results.length);
									console.log(results);
								};
							});
							};
						fs.close(fd);
						});
					});
				}else if(options.recursive && stat.isDirectory()){
					lookInDirectory(file);
				}
			});
		});
	});
}; // lookInDirectory()

function report(){
	setOptions(options)
	console.log('from path:',options.dir);
	console.log('search '.concat((options.casesensitive ? 'case-sensitive ':''),(options.regex ? 'as regular expression ':''), 'for:'), options['-search'].is)
	console.log('using pattern:', options.search);
	console.log('excluding pattern:', options.exclude);
	console.log('will search:',options.recursive?(options.depth?options['-depth'].is.toString().concat(' directories deep'):'recursively'):'just the current directory');
	lookInDirectory(options.dir);
}; // report()
report();
