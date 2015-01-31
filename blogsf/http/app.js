var serv
	,http = require('http')
	,fs = require('fs')
	,PORT = +process.env.PORT || 3000
	,WWW = (process.env.PWD + (process.argv.length > 2 ? '/'+process.argv[ process.argv.length - 1 ] : '')).replace(/\/\s*$/,'')
	,usage = [
		''
		,'usage:'
		,'eg % PORT=8888 && node ./http/app.js ./relative/path/to/root/'
		,''
		,'run silently % node ./http/app.js base/ > /dev/null 2>&1'
		,'Note trailing path relative to the current directory.'
	]
	;

	console.log( usage.join('\n\t') );

	serv = http.createServer(function(req, res){

		// strip get args, strip directories, strip filename to trailing extension
		var ext = req.url.replace(/\?.*$/,'');
		var path = WWW + ext;
		var read = fs.createReadStream( path );
		ext = ext.replace(/^.*\//,'').replace(/^.*\./,'')
		console.log('%s %s', req.method, req.url);

		function handle(){
		// body = 404 message
			var body, type = 'text/plain';
			switch( ext.toLowerCase() ){
			case 'js':
				type = 'application/javascript';
				body = '/* not found */';
			break;
			case 'txt':
				type = 'text/plain';
				body = 'not found '+req.url;
			break;
			case 'json':
				type = 'application/json';
				body = '{}';
			break;
			case 'css':
				type = 'text/css';
				body = '/* not found */';
			break;
			case 'ico':
				type = 'image/x-icon';
			case 'png':
				type = 'image/png';
			break;
			case 'gif':
				type = 'image/gif';
			break;
			case 'jpg':
				type = 'image/jpeg';
			break;
			default:
				type = 'text/html';
				body = "<!doctype html>\n<html><body>404, can't find " + req.url;
			};
			return {type: type, body: body};
		};
		read.pipe( res );

		read.on('open',function(e){
			res.writeHead(200, {'Content-Type': handle().type});
		});

		read.on('error',function(e){
			var setup = handle();
			if(setup.type !== 'text/html'){
				res.writeHead(404, {'Content-Type': setup.type});
				res.end(setup.body);
			}else{
				res.writeHead(200, {'Content-Type': setup.type});
				// reuse variable
				path = WWW + '/index.html';
				read = fs.createReadStream( path );
				read.pipe( res );
				read.on('error', function(e){
					console.log("DOH! couldn't substitue index for 404 %s", path);
					res.end(setup.body);
				});
			};
		});

	}).listen( PORT );

	console.log([
		''
		,'http running on %s'
		,'serving files from %s'
		,'open http://127.0.0.1:%s/'
	].join('\n\t'), PORT, WWW, PORT);

