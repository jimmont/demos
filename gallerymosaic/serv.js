var http = require('http')
,fs = require('fs')
;
http.createServer(function(req, res){
	var file, callback = req.url.match(/\/([^\/\?]+)\?.*?\bcallback=([^&]+)/);
	if(callback && callback.length > 2){
		file = callback[1];
		callback = callback[2];
	};
	if(!file) return res.end('----');
//	else return res.end('file:'+file +'; cb:'+callback);
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
}).listen('8123');

