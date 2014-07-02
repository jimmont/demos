var PORT = 3000;
	var serverDomain, server, app
	,domain = require('domain')
	,express = require('express')
	,path = require('path')
	,compression = require('compression')
	,maxAge = 1000*60*60*24*1
//	,heapdump = require('heapdump')
,fs = require('fs')
	;

	serverDomain = domain.create();
	serverDomain.on('error', function(err){
		var killer;
		console.error('restart: '+ (new Date) +' '+JSON.stringify(err));
		try{
			killer = setTimeout(function(){
				process.exit(1);
			}, 5000);
			killer.unref();
			server.close();
		//	cluster.worker.disconnect();
		}catch(err2){
			console.error('restart failed: %s', JSON.stringify(err2));
		};
	});
	serverDomain.run(function(){
		app = express();
		var isDev = 'development' === app.get('env') ? 1:0;
		// gzip when not in development
		if(!isDev) app.use(compression({
			threshold: '1kb'
			,level: 4
		}));
		app.use(express.static('app', 
			isDev ? {} :  { maxAge: maxAge }
		));
		// capture all 404s
		app.use(function(req, res, next){
			// return an appropriate response
/*
			if(/^dump\b/.test(req.url)){
				heapdump.writeSnapshot();
				return res.send(200,'heapdump snapshot saved');
			};
*/
			if(/^\/api\/|\.json\b/i.test(req.url)){
				var file, callback = req.url.match(/\/([^\/\?]+)\?.*?\bcallback=([^&]+)/);
				if(callback && callback.length > 2){
					file = callback[1];
					callback = callback[2];
				};
				if(!file){
					return res.send(404,{error:'not found'});
				}else{
					var stream = fs.createReadStream(file);
					stream.on('error', function(){
						res.end();
					});
					stream.on('open', function(){
						res.write(callback+'(');
						stream.pipe(res);
					});
					stream.on('end', function(){
						res.write(')');
					});
					return;
				};
			}else if(/\.js\b/i.test(req.url)){
				return res.send(404,'// 404');
			}else if(/\.css\b/i.test(req.url)){
				return res.send(404,'/* 404 */');
			}else if(/\.(jpg|gif|png|ico)\b/i.test(req.url)){
				return res.status(404).sendfile(path.resolve(__dirname+'/app/img/404.gif'));
			}else if(req.accepts('html')){
//				if(/\b500\b/.test(req.originalUrl)) throw 'throw 500 error';
				// respond to all html requests with the index, which will handle any unknown routes of this type
				return res.sendfile( path.resolve(__dirname+'/app/index.html'));
			};
			res.type('txt').send('not found');
		});
		// print out something useful for 500s
		app.use(function(err,req,res,next){
			console.error('500 error %s for %s\n%s', new Date, req.method, req.originalUrl, JSON.stringify(err));
			next(err);
		});
		server = require('http').createServer(app).listen(PORT);
console.log("serving on %s",PORT);
	});
