// EasyLS Node Edition
// A free link shortener
// Created By Adam Blunt (adamblunt.me & adamxp12.com) @admblnt


var express = require('express'),
 app = require('express')(),
 http = require('http').Server(app),
 session = require('express-session'),
 MongoStore = require('connect-mongo')(session),
 bodyParser = require('body-parser'),
 clear = require("cli-clear"),
 mongoose = require('mongoose'),
 bcrypt = require('bcrypt-nodejs'),
 fs = require('fs'),
 func = require('./func'),
 config = require('./conf/config');

var ver = 1.1;
var verName = ver+' alpha';

// Express Setup
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));


// Database Connect
mongoose.connect('mongodb://localhost/EasyLS');

// Setup Sessions
app.use(session({
	store: new MongoStore({ mongooseConnection: mongoose.connection }),
	secret: config.sessionkey,
	saveUninitialized: false,
	resave: false
}));

// Database Setup
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

	// User Schema
var adminUserSchema = new Schema({
    username    : String,
    email     : String,
    password      : String
});

var adminUser = mongoose.model('adminUser', adminUserSchema);

	// Shortlink Schema
var shortLinkSchema = new Schema({
    shortlink    : { type : String , unique : true, required : true, dropDups: true },
    longurl     : { type : String , unique : true, required : true, dropDups: true },
    createdby      : String,
    linktype		: String,
    date 			: Date,
    amazonaffcode	: String,
    shortlinktype	: String,
    shortlinkcontent	: String,
    clicks		: Number,
    twitterclicks		: Number,
    facebookclicks		: Number,

});

var shortLink = mongoose.model('shortLink', shortLinkSchema);



// Template files
	// Tacky code but it works great so don't judge me
var header = fs.readFileSync("./includes/header.inc", "utf8", function(err, data) { if (err) throw err; });
var footer = fs.readFileSync("./includes/footer.inc", "utf8", function(err, data) { if (err) throw err; });
var login = fs.readFileSync("./includes/login.inc", "utf8", function(err, data) { if (err) throw err; });
var dashboard = fs.readFileSync("./includes/dashboard.inc", "utf8", function(err, data) { if (err) throw err; });
var shortlinkspage = fs.readFileSync("./includes/shortlinks.inc", "utf8", function(err, data) { if (err) throw err; });
var addshortlinkpage = fs.readFileSync("./includes/newshortlink.inc", "utf8", function(err, data) { if (err) throw err; });
var shortlinkeditpage = fs.readFileSync("./includes/newshortlink.inc", "utf8", function(err, data) { if (err) throw err; });
var menu = fs.readFileSync("./includes/menu.inc", "utf8", function(err, data) { if (err) throw err; });

// Root directory
// TODO: add redirect and landing page functions
app.get('/', function(req,res){
	page = header+"error"+footer;
	res.send(page);
});

// Login Page
app.get('/admin/login', [initlogin, addcounts, sendlogin]);

function initlogin(req, res, next) {
	session=req.session;
	if(session.user) {
		res.redirect('/admin');
	} else {
		page = header+login+footer;
    req.page = page;
		next();
	}
};

function sendlogin(req, res) {
	req.page = req.page.replace('{linkcount}', req.linkcount);
	req.page = req.page.replace('{systemname}', config.systemname);
	req.page = req.page.replace('{version}', verName);
	res.send(req.page);
}


// Logout User
app.get('/admin/logout',function(req,res){
	req.session.user=null;
	req.session.destroy();
	res.redirect('/admin');
});

// Admin Dashboard
// TODO: Add interactivity
app.get('/admin', [initdashboard, addcounts, senddashboard]);

function initdashboard(req, res, next) {
	session=req.session;
	if(session.user) {
		page = header+dashboard+footer;
		page = func.replaceall(page, session.user, '{currentuser}');
		page = page.replace('{menu}', menu);
		req.page = page;
		next();

	} else {
		res.redirect('/admin/login');
	}
}



function addcounts(req, res, next) {
	// Count links
	shortLink.count({}, function( err, count){
    	req.linkcount = count;
	});

	// Count Clicks
	req.totalclicks = 0;
	req.twitterclicks = 0;
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
			<td>" + links[i].twitterclicks + "</td> \
			</tr> ";
			req.shortlinks = linklist;
		}
		next();
	});


}

function senddashboard(req, res) {
	req.page = req.page.replace('{linkcount}', req.linkcount);
	req.page = req.page.replace('{totalclicks}', req.totalclicks);
	req.page = req.page.replace('{twitterclicks}', req.twitterclicks);
	req.page = req.page.replace('{facebookclicks}', req.facebookclicks);
	req.page = req.page.replace('{shortlinks}', req.shortlinks);
	res.send(req.page);
}

// Shortlinks page
// TODO: Add pagnation at bottom
app.get('/admin/shortlinks/:pagenumber', [initshortlinkspage, makeshortlinkstable, makeshortlinkspage]);
function initshortlinkspage(req, res, next) {
	session=req.session;
	if(session.user) {
		page = header+shortlinkspage+footer;
		page = func.replaceall(page, session.user, '{currentuser}');
		page = page.replace('{menu}', menu);
		req.easylspage = page;
		next();
	} else {
		res.redirect('/admin/login');
	}
}

function makeshortlinkstable(req, res, next) {
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
			<td>' + links[i].twitterclicks +'</td> \
			<td><button class="button tiny" type="button" data-toggle="' + links[i].shortlink + '"><i class="fa fa-fw fa-bars"></i></button> \
			<div class="dropdown-pane" id="' + links[i].shortlink + '" data-dropdown data-hover="true" data-hover-pane="true"> \
  				<ul class="menu vertical shortlinkeditmenu"> \
  					<li><a href="/admin/edit/'+ links[i].shortlink + '">Edit ' + links[i].shortlink + '</a></li> \
  					<li><a href="#" class="copy" data-clipboard-text="http://admb.ga/' + links[i].shortlink + '" data-clipboard-target="#' + links[i].shortlink + '">Copy Link</a></li> \
  					<li><a href="#" class="reddelete">Delete</a></li> \
				</ul> \
			</div> \
			</tr> ';
		}
		req.easylslinklist = linklist;
		next();

	});
};


function makeshortlinkspage(req, res) {
	req.easylspage = req.easylspage.replace('{shortlinks}', req.easylslinklist);
	res.send(req.easylspage);
}
// End shortlinks page

// New shortlink page
// TODO: fix SmartLink and link types
app.get('/admin/addshortlink', function(req,res){
	session=req.session;
	if(session.user) {
		page = header+addshortlinkpage+footer;
		page = func.replaceall(page, session.user, '{currentuser}');
		page = page.replace('{menu}', menu);
		res.send(page);
	} else {
		res.redirect('/admin/login');
	}

});

app.post('/admin/addshortlink', function(req,res){
	session=req.session;
	if(session.user) {
		var newshortlink = new shortLink({
    		shortlink    : req.body.shortlink,
    		longurl     : req.body.longurl,
    		createdby      : session.user,
    		linktype		: req.body.linktype,
    		date 			: Math.floor(new Date() / 1000),
    		clicks		: 0,
    		twitterclicks		: 0,
    		facebookclicks		: 0,
		});
		newshortlink.save(function(err, newshortlink) {
  			if (err) return console.error(err);
		});
		res.redirect('/admin/shortlinks/1');
	} else {
		res.redirect('/admin/login');
	}
});

// Login handler
app.post('/login', function(req,res){
	session=req.session;
	adminUser.findOne({ username: req.body.user }, function(err, user) {
    	if (err) return console.error(err);
    	if(user == null) {
    		// Username not in database
    		res.redirect('/admin/login');
    	} else {
    		// We found a user, now check if thier password matches
    		if(bcrypt.compareSync(req.body.pass, user.password)) {
				session.user = req.body.user;
				res.redirect('/admin/');
			} else {
				res.redirect('/admin/login');
			}
    	}

	});


});
// New User Test
// TODO: Remove
app.post('/new', function(req,res){
	var newuser = new adminUser({
    	username    : req.body.user,
    	email     : "test@test.coms",
    	password      : bcrypt.hashSync(req.body.pass)

	});
	newuser.save(function(err, newuser) {
  		if (err) return console.error(err);
	});
	res.redirect('/admin/logout');
});

// Shortlink
app.get('/:shortlink', [findshortlink, redirectshortlink]);

function findshortlink(req, res, next) {
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

}

function redirectshortlink(req, res, next) {
	// TODO: Logic for smartlinks
	res.redirect(req.result.longurl);
}

function countshortlinks() {
	shortLink.count({}, function( err, count){
    	return count;
	});
}

app.get('/admin/edit/:shortlinkid', [initshortlinkedit, getshortlinkpagedata, makeshortlinkeditpage]);

function initshortlinkedit(req, res, next) {
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
}

function getshortlinkpagedata(req, res, next) {
  next()
}

function makeshortlinkeditpage(req, res, next) {
  res.send(req.easylspage);
}


// *************************************************
// * Print console text and start server listening *
// *************************************************
clear(); // Console clearing is a must, personal opinion feel free to comment this out if you h8 it m8
console.log(''); // Print blank line first to make it easier to read
console.log('    ______                 __   _____');
console.log('   / ____/___ ________  __/ /  / ___/');
console.log('  / __/ / __ `/ ___/ / / / /   \\__ \\ ');
console.log(' / /___/ /_/ (__  ) /_/ / /______/ / ');
console.log('/_____/\\__,_/____/\\__, /_____/____/ ');
console.log('                 /____/              ');
console.log('');
console.log('****************************************************************')
console.log('EasyLS NodeJS Edition V'+ver+' - System Name: '+config.systemname);
console.log('****************************************************************');
console.log('');
// Check system for anything that might be stupid to leave default
if(config.sessionkey=="changeme") {
	console.log('Server Not Started');
	console.log('Reason: Session Key default');
	console.log('See config.js line25 for more info');
	console.log('');
	process.exit();
} else {
	http.listen(3000, function(){
  		console.log('listening on *:3000');
	});
}
