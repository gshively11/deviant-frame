var express = require('express');
var DeviantClient = require('./libs/deviantClient');
var app = express();

var deviant = new DeviantClient({
	baseUrl: 'http://backend.deviantart.com/rss.xml?type=deviation'
});

app.get('/popular', function(req, res){
	deviant.test().then(function(images){
		//var content = JSON.stringify(images);
		res.setHeader('Content-Type', 'text/plain');
		res.setHeader('Content-Length', Buffer.byteLength(images));
		res.end(images);
	});
});

app.listen(3000);
console.log('Listening on port 3000');