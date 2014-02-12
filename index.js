var express = require('express');
var DeviantClient = require('./libs/deviantClient');
var app = express();
var url = require('url');
var _ = require('underscore');

var deviant = new DeviantClient({
	baseUrl: 'http://backend.deviantart.com/rss.xml?type=deviation'
});

app.get('/popular', function(req, res){
	deviant.popular().then(function(images){
		sendJson(res, images);
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