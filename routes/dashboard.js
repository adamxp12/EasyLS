var fs = require('fs'),
	mongoose = require('mongoose');
	config = require('../conf/config')

var shortLink = require('mongoose').model('shortLink');


var func = require('../func');
var header = fs.readFileSync("./includes/header.inc", "utf8", function(err, data) { if (err) throw err; });
var dashboard = fs.readFileSync("./includes/dashboard.inc", "utf8", function(err, data) { if (err) throw err; });
var footer = fs.readFileSync("./includes/footer.inc", "utf8", function(err, data) { if (err) throw err; });
var menu = fs.readFileSync("./includes/menu.inc", "utf8", function(err, data) { if (err) throw err; });

module.exports = {
	initdashboard: function(req, res, next) {
	session=req.session;
	if(session.user) {

		page = header+dashboard+footer;
		page = func.replaceall(page, session.user, '{currentuser}');
		page = page.replace('{menu}', menu);
		page = page.replace('{sysname}', config.systemname);
		req.page = page;
		next();

	} else {
		res.redirect('/admin/login');
	}
	},

	addcounts: function(req, res, next) {
	// Count links
	shortLink.count({}, function( err, count){
    	req.linkcount = count;
	});

	// Count Clicks
	req.totalclicks = 0;
	req.twitterclicks = 0;
	req.facebookclicks = 0;
	// The following causes is throwing a DeprecationWarning. Mongo's bigest short comming is simple counting of values without loops.
	// MySQL can do it simply. why cant Mongo :(
	// Because this works and cba to write something else it will have to do.
	shortLink.aggregate([
        { $group: {
            _id: '$shortlink',
            clickcount: { $sum: '$clicks'},
            twitterclickcount: { $sum: '$twitterclicks'},
            facebookclickcount: { $sum: '$facebookclicks'}
        }}
    ], function (err, results) {
        if (err) {
            console.error(err);
            req.totalclicks += 0;
    		req.twitterclicks += 0;
    		req.facebookclicks += 0;
        } else {
            for (i = 0; i < results.length; i++) {
    			req.totalclicks += results[i].clickcount;
    			req.twitterclicks += results[i].twitterclickcount;
    			req.facebookclicks += results[i].facebookclickcount;
			}
        }
    }
);

	// Make shortlink table
	var linklist = "";
	shortLink.find()
	.sort({'date': -1})
	.limit(3)
	.exec(function(err, links) {
		for(var i=0; i<links.length; i++) {
			linklist = linklist + "<tr> \
			<td>" + links[i].shortlink + "</td> \
			<td>" + links[i].longurl + "</td> \
			<td>" + links[i].clicks + "</td> \
			</tr> ";
			req.shortlinks = linklist;
		}
		next();
	});
	},
	senddashboard: function(req, res) {
	req.page = req.page.replace('{linkcount}', req.linkcount);
	req.page = req.page.replace('{totalclicks}', req.totalclicks);
	//req.page = req.page.replace('{twitterclicks}', req.twitterclicks);
	//req.page = req.page.replace('{facebookclicks}', req.facebookclicks);
	console.log(req.facebookclicks)
	req.page = req.page.replace('{shortlinks}', req.shortlinks);
	res.send(req.page);
}
}