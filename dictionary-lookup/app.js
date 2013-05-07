
/**
 * Module dependencies.
 */

var app
	,dictionary = {}
	,express = require('express')
	,doT = require('express-dot')
	, http = require('http')
	, path = require('path')
	, jsdom = require('jsdom');
app = express();

app.configure(function(){
	app.locals({ layout: false });
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set("view engine", "html");
	app.engine('html', doT.__express);
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
/*
	app.use(express.cookieParser('your secret here'));
	app.use(express.session());
*/
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

app.get(/^\/([^\/]*)(?:\/.*)?$/, function(req, res){
	var callcount = 0, word = (req.params[0] || '').replace(/^[\s?]+/,'').replace(/\s+$/,'');
	word = word || 'search';
	var definitions = dictionary[word] || [];
	if(!definitions.length && word && /^[a-z]/i.test(word)){
		console.log('search for word:',word);
		dictionary[word] = definitions;
		var google = http.get({
			host: 'www.google.com'
			,port: 80
			,path: '/dictionary/json?callback=callme&sl=en&tl=en&restrict=pr%2Cde&client=te&q='+encodeURIComponent(word)
		}, function(response) {
			var res_data = '';
			response.setEncoding('utf8');
			response.on('data', function(chunk) {
				res_data += chunk;
			});
			response.on('end', function() {
				var items, item, defs = [], eg = [];
				items = res_data;//.replace(/^callme\(/,'').replace(/},\d+,null\).*$/,'}').replace(/\\x(\d)/g, '\\u000$1');
				try{
					items = jsdom.jsdom('<html><body><script>var _word;function callme(w,n,h){ _word = w;}'+res_data+'</script></body></html>');
					items = items._parentWindow._word.webDefinitions[0].entries;
					while(item = items.shift()){
						defs.push(item.terms[0].text);
					}
				}catch(err){
					console.log('error processing google definition',err,'\ndetails:',item,items);
				};
				definitions.push({
					label: 'Google'
					,definitions: defs
					,examples: eg
				});
				render(1);
			});
		});
		google.on('error', function(err) {
			console.log("Request error: " + err.message);
			render(1);
		});

		var urbandictionary = http.get({
			host: 'www.urbandictionary.com'
			,port: 80
			,path: '/define.php?term='+encodeURIComponent(word)
		}, function(response) {
			var res_data = '';
			response.on('data', function(chunk) {
				res_data += chunk;
			});
			response.on('end', function() {
				var defs = [], eg = [], i = 0, item, items = jsdom.jsdom(res_data.replace(/(script|iframe|img)/gi,'no-$1')).querySelectorAll('#entries .definition,#entries .example');
				while(item = items[i++]){
					(/definition/.test(item.className) ? defs : eg).push(item.textContent);
				};
				definitions.push({
					label: 'Urban Dictionary'
					,definitions: defs
					,examples: eg
				});
				render(1);
			});
		});
		urbandictionary.on('error', function(err) {
			console.log("problems getting Urban Dictionary definitions" + err.message);
			render(1);
		});
	}else{
		render(2);
	};
	function render(count){
		callcount += count;
		if(callcount>1) res.render('index', {title: 'API IPA * dictionary', word: word, definitions: definitions});
	};
});

http.createServer(app).listen(app.get('port'), function(){
	console.log("listening on port " + app.get('port'));
});
