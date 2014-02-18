var express = require('express');
var DeviantClient = require('./libs/deviantClient');
var Downloader = require('./libs/downloader');
var app = express();
var url = require('url');
var _ = require('underscore');

var deviant = new DeviantClient({
	baseUrl: 'http://backend.deviantart.com/rss.xml?type=deviation'
});

var downloader = new Downloader({downloadPath: 'c:\\temp\\images'});

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.sendfile('index.html', {root: './public'});
});

app.get('/popular', function(req, res){
	deviant.popular().then(function(images){
		sendJson(res, images);
	});
});

app.get('/populardownload', function(req, res){
	console.log('Starting to download files');
	deviant.popular()
		.then(function(images){
			downloader.downloadAll(images, function(err){
				console.log('successful download!');
				sendJson(res, {success: true});
			})
		});
});

app.get('/query', function(req, res){
	deviant.query(req.query.q).then(function(images){
		sendJson(res, images);
	});
});

function sendJson(response, object) {
	var content = JSON.stringify(object);
	response.setHeader('Content-Type', 'application/json');
	response.setHeader('Content-Length', Buffer.byteLength(content));
	response.end(content);
}

app.listen(3000);
console.log('Listening on port 3000');