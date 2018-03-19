var packagejson = require('../package.json'),
    fs = require('fs'),
	config = require('../conf/config'),
	mongoose = require('mongoose'),
    func = require('../func');

var shortLink = require('mongoose').model('shortLink');

var header = fs.readFileSync("./includes/header.inc", "utf8", function(err, data) { if (err) throw err; });
var menu = fs.readFileSync("./includes/menu.inc", "utf8", function(err, data) { if (err) throw err; });
var shortlinkspage = fs.readFileSync("./includes/shortlinks.inc", "utf8", function(err, data) { if (err) throw err; });
var footer = fs.readFileSync("./includes/footer.inc", "utf8", function(err, data) { if (err) throw err; });


module.exports = {
    initshortlinkspage: function (req, res, next) {
	session=req.session;
	if(session.user) {
		page = header+shortlinkspage+footer;
		page = func.replaceall(page, session.user, '{currentuser}');
		page = page.replace('{menu}', menu);
		page = page.replace('{sysname}', config.systemname);
		req.easylspage = page;
		next();
	} else {
		res.redirect('/admin/login');
	}
},

 makeshortlinkstable: function(req, res, next) {
	var offsetval = req.params.pagenumber * 10 - 10;
	shortLink.find()
	.sort({'date': -1})
	.limit(10)
	.skip(offsetval)
	.exec(function(err, links) {
		var linklist = "";
		for(var i=0; i<links.length; i++) {
			linklist = linklist + '<tr> \
			<td>' + links[i].shortlink + '</td> \
			<td>' + links[i].longurl + '</td> \
			<td>' + links[i].clicks + '</td> \
			<td><button class="button tiny" type="button" data-toggle="' + links[i].shortlink + '"><i class="fa fa-fw fa-bars"></i></button> \
			<div class="dropdown-pane" id="' + links[i].shortlink + '" data-dropdown data-hover="true" data-hover-pane="true"> \
  				<ul class="menu vertical shortlinkeditmenu"> \
  					<li><a href="/admin/edit/'+ links[i].shortlink + '">Edit ' + links[i].shortlink + '</a></li> \
  					<li><a href="#" class="copy" data-clipboard-text="http://admb.ga/' + links[i].shortlink + '" data-clipboard-target="#' + links[i].shortlink + '">Copy Link</a></li> \
  					<li><a class="reddelete" data-open="'+ links[i].shortlink +'delete">Delete</a></li> \
				</ul> \
			</div> \
			</tr> \
			<div class="reveal" id="'+ links[i].shortlink +'delete" data-reveal> \
  <h1>You sure?</h1> \
  <p class="lead">This will delete <b>'+ links[i].shortlink +'</b></p> \
  <p>This is a <span style="color:red;">DESTRUCTIVE</span> process, you can not undo this</p> \
  <p>You 100% sure you want to delete <kbd>'+ links[i].shortlink +'</kbd> </p>\
  <a class="button alert large" href="/admin/delete/'+ links[i].shortlink +'">GO Ahead</a> \
  <a data-close class="button success large">NO! I WANT THAT</a> \
  <button class="close-button" data-close aria-label="Close modal" type="button"> \
    <span aria-hidden="true">&times;</span> \
  </button> \
</div>';
		}
		req.easylslinklist = linklist;
		next();

	});
},

makeshortlinkspage: function(req, res) {
	req.easylspage = req.easylspage.replace('{shortlinks}', req.easylslinklist);
	res.send(req.easylspage);
}

};