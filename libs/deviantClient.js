var request = require('request');
var xml2js = require('xml2js');
var FeedParser = require('feedparser');
var Promise = require('promise');

function DeviantClient(config) {
	this.config = config;
}

DeviantClient.prototype.popular = function() {
	var url = this.config.baseUrl + '&q=boost%3Apopular';
	console.log('Getting URL: ' + url);
	return new Promise(function(resolve, reject){
		request.get(url, function(error, response, body){
			if(error) return reject(error);
			xml2js.parseString(body, function(error, result){
				if(error) return reject(error);
				resolve(result);
			});
		});	
	});
}

DeviantClient.prototype.test = function(){
	var url = this.config.baseUrl + '&q=by%3Aspyed+sort%3Atime+meta%3Aall';
	return new Promise(function(resolve, reject){
		request.get(url, function(error, response, body){
			if(error) return reject(error);
			xml2js.parseString(body, function(error, result){
				if(error) return reject(error);
				resolve(result);
			});
		});	
	});
}

module.exports = DeviantClient;