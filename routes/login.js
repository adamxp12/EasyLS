var packagejson = require('../package.json'),
    fs = require('fs'),
	config = require('../conf/config'),
	mongoose = require('mongoose');

var shortLink = require('mongoose').model('shortLink');

var header = fs.readFileSync("./includes/header.inc", "utf8", function(err, data) { if (err) throw err; });
var login = fs.readFileSync("./includes/login.inc", "utf8", function(err, data) { if (err) throw err; });
var footer = fs.readFileSync("./includes/footer.inc", "utf8", function(err, data) { if (err) throw err; });
var ver = packagejson.version;
var verName = ver+' alpha';

module.exports = {
	initlogin: function(req, res, next) {
		session=req.session;
		if(session.user) {
			res.redirect('/admin');
		} else {
			page = header+login+footer;
			req.page = page;
			next();
		}
	}, 
	countlinks: function(req, res, next) {
	// Count links
		shortLink.count({}, function( err, count){
    		req.linkcount = count;
    		next();
		});
		
	},
	sendlogin: function(req, res) {
		req.page = req.page.replace('{linkcount}', req.linkcount);
		req.page = req.page.replace('{systemname}', config.systemname);
		req.page = req.page.replace('{version}', verName);
		res.send(req.page);
	}
}