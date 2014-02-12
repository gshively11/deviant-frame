var request = require('request');
var xml2js = require('xml2js');
var FeedParser = require('feedparser');
var Promise = require('promise');
var _ = require('underscore');

function DeviantClient(config) {
	this.config = config;
}

DeviantClient.prototype.popular = function() {
	return this.query('boost%3Apopular');
};

DeviantClient.prototype.popularInCategory = function(category) {
	return this.query('boost%3Apopular+in%3A' + category);
};

DeviantClient.prototype.user = function(user) {
	return this.query('gallery%3A' + user);
};

DeviantClient.prototype.query = function(query) {
	var url = this.config.baseUrl + '&q=' + query;
	console.log('Getting URL: ' + url);
	var feedMeta;
	var images = [];
	return new Promise(function(resolve, reject){
		request.get(url).pipe(new FeedParser())
			.on('error', function(error){
				reject(error);
			})
			.on('meta', function(meta){
				feedMeta = meta;
			})
			.on('readable', function(){
				var stream = this
					, item;
				while(item = stream.read()) {
					var mediaContent = item['media:content'];
					var image = {
						title: item.title,
						url: (mediaContent 
							&& mediaContent.hasOwnProperty('@') 
							&& mediaContent['@'].hasOwnProperty('url'))
								? mediaContent['@']['url']
								: null
					};
					if(image.url != null)
						images.push(image);
				}
			})
			.on('end', function(){
				resolve(images);
			});
	});
};

module.exports = DeviantClient;