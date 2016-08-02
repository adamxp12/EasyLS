var mongoose = require('mongoose');
var shortLink = require('mongoose').model('shortLink');

module.exports = {

	findshortlink: function(req, res, next) {
		shortLink.findOne({shortlink: req.params.shortlink}, function(err, result){
			if(result) {
			// YAS, WE FIND A SHORTURL
			result.clicks = result.clicks+1;
			result.save();
			req.result = result;
			next();
		} else {
			// No shortlink found so redirect to homepage
			res.redirect('/');
		}
	})

	},
	redirectshortlink: function (req, res, next) {
		// TODO: Logic for smartlinks
		res.redirect(req.result.longurl);
	},

}