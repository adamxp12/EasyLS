var mongoose = require('mongoose');
var shortLink = require('mongoose').model('shortLink');

module.exports = {
	replaceall: function(text, result, string) {
		var replace = new RegExp(string, 'g');
		return text.replace(replace, result);
	},
	countshortlinks: function() {
	shortLink.count({}, function( err, count){
    	return count;
	});
}
}
