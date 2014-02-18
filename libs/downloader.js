var http = require('http')
	, url = require('url')
	, fs = require('fs')
	, path = require('path')
	, _ = require('lodash')
	, Promise = require('promise')
	, async = require('async');

var imageRegex = /\.(?:png|jpg)$/i;

function getImageExtension(imageUrl) {
	var parsedUrl = url.parse(imageUrl);
	var extension = parsedUrl.pathname.match(imageRegex);
	if(!extension) {
		console.log("No file extension");
		return;
	}
	return extension[0];
};

function Downloader(options) {
	this.options = options;
	this.imageCounter = 0;
}

Downloader.prototype.download = function(image, cb) {
	var self = this;
	async.waterfall(
		[
			function(callback) {
				self.getFile(image.url, callback);
			},
			function(imageData, callback) {
				var filePath = path.resolve(self.options.downloadPath, (self.imageCounter++) + getImageExtension(image.url));
				console.log('Saving to ' + filePath);
				fs.writeFile(filePath, imageData, 'binary', function(){
					callback();
				});
			}
		],
		cb
	);
};

Downloader.prototype.downloadAll = function(images, cb) {
	var self = this;
	images = images.slice(0, 2);
	console.log('Downloading ' + images.length + ' images');
	async.each(images, function(image, callback) {
		self.download.call(self, image, callback);
	}, cb);
};

Downloader.prototype.getFile = function(imageUrl, cb) {
	console.log('Downloading ' + imageUrl)
	var imageData = '';
	http.get(imageUrl, function(res){
		res.setEncoding('binary');
		res.on('data', function(chunk){
			imageData += chunk;
		});
		res.on('end', function(){
			console.log('Received file ' + imageUrl);
			cb(null, imageData);
		});
		res.on('error', function(err){
			console.log('Error ' + err);
			cb(err);
		});
	});
};

module.exports = Downloader;

