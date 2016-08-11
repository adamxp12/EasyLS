var fs = require('fs'),
	mongoose = require('mongoose'),
    shortLink = require('mongoose').model('shortLink');

var header = fs.readFileSync("./includes/header.inc", "utf8", function(err, data) { if (err) throw err; });
var menu = fs.readFileSync("./includes/menu.inc", "utf8", function(err, data) { if (err) throw err; });
//TODO: Put proper template file here, even thought it would probably just be the same thing
var shortlinkeditpage = fs.readFileSync("./includes/newshortlink.inc", "utf8", function(err, data) { if (err) throw err; });
var footer = fs.readFileSync("./includes/footer.inc", "utf8", function(err, data) { if (err) throw err; });

var func = require('../func');

module.exports = {


	initshortlinkedit: function(req, res, next) {
		session=req.session;
		if(session.user) {
			page = header+shortlinkeditpage+footer
			page = func.replaceall(page, session.user, '{currentuser}');
			page = page.replace('{menu}', menu);
			req.easylspage = page;
			next();
		} else {
			res.redirect('/admin/login');
		}
	},

	getshortlinkpagedata: function(req, res, next) {
		//TODO: Get data for the shortlink
		next()
	},

	makeshortlinkeditpage: function(req, res, next) {
		//TODO: Display data
		res.send(req.easylspage);
	},

}