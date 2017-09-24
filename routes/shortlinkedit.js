var fs = require('fs'),
	mongoose = require('mongoose'),
    shortLink = require('mongoose').model('shortLink'),
	config = require('../conf/config');

var header = fs.readFileSync("./includes/header.inc", "utf8", function(err, data) { if (err) throw err; });
var menu = fs.readFileSync("./includes/menu.inc", "utf8", function(err, data) { if (err) throw err; });
//TODO: Put proper template file here, even thought it would probably just be the same thing
var shortlinkeditpage = fs.readFileSync("./includes/editshortlink.inc", "utf8", function(err, data) { if (err) throw err; });
var footer = fs.readFileSync("./includes/footer.inc", "utf8", function(err, data) { if (err) throw err; });

var func = require('../func');

module.exports = {


	initshortlinkedit: function(req, res, next) {
		session=req.session;
		if(session.user) {
			page = header+shortlinkeditpage+footer
			page = func.replaceall(page, session.user, '{currentuser}');
			page = page.replace('{menu}', menu);
			page = page.replace('{sysname}', config.systemname);
			req.page = page;
			next();
		} else {
			res.redirect('/admin/login');
		}
	},

	getshortlinkpagedata: function(req, res, next) {
		//TODO: Get data for the shortlink
		shortLink.findOne({shortlink: req.params.shortlinkid}, function(err, result){
			if(result) {
				req.result = result;
				next();
			} else {
				// No shortlink found so redirect to homepage
				res.redirect('/');
			}
		});
		
	},

	makeshortlinkeditpage: function(req, res, next) {
		page = req.page;
		page = page.replace('{longurl}', req.result.longurl);
		page = page.replace('{shortlink}', req.result.shortlink);
		if(req.result.linktype === "generic") { page = page.replace("{genericchecked}", "selected")}
		if(req.result.linktype === "amazon") { page = page.replace("{amazonchecked}", "selected")}
		if(req.result.linktype === "youtube") { page = page.replace("{youtubechecked}", "selected")}
		if(req.result.amazonaffcode) { page = page.replace("{affid}", req.result.amazonaffcode) } else { page = page.replace("{affid}", "")}
		if(req.result.smartlink) { page = page.replace("{smartlinkchecked}", "checked")}
		// TODO: Fill rest of data
		res.send(page);
	},

}