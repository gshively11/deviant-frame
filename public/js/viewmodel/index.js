define(['jquery', 'lodash', 'knockout'], function($, _, ko){
	function IndexViewModel(){
		this.images = ko.observableArray([]);
	}

	IndexViewModel.prototype.init = function(){
		ko.applyBindings(this);
	};

	IndexViewModel.prototype.loadImages = function(){
		var self = this;
		$.ajax({
			url: '/popular'
		}).done(function(images){
			self.images(images);
		});
	};

	IndexViewModel.prototype.downloadImages = function(){
		$.ajax({
			url: '/populardownload'
		}).done(function(result){
			alert(result.success);
		}).fail(function(){
			alert('failed!');
		});
	};
	return IndexViewModel;
});