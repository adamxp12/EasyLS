// EasyLS Node Edition
// A free link shortener
// Powered by NodeJS, Express and MongoDB
// Created By Adam Blunt (adamblunt.me & adamxp12.com) @admblnt


var packagejson = require('./package.json'),
 express = require('express'),
 app = require('express')(),
 http = require('http').Server(app),
 session = require('express-session'),
 MongoStore = require('connect-mongo')(session),
 bodyParser = require('body-parser'),
 clear = require("cli-clear"),
 mongoose = require('mongoose'),
 bcrypt = require('bcrypt-nodejs'),
 fs = require('fs'),
 shortid = require('shortid'),
 config = require('./conf/config');


var ver = packagejson.version;
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
var UserSchema = new Schema({
    username    : String,
    email     : String,
    password      : String
});

var easyLsUser = mongoose.model('easyLsUser', UserSchema);

// Shortlink Schema
var shortLinkSchema = new Schema({
    shortlink    : { type : String , unique : true, required : true, dropDups: true },
    longurl     : { type : String , unique : true, required : true, dropDups: true },
    createdby      : String,
    linktype		: String,
    date 			: Date,
    amazonaffcode	: String,
	smartlink		: {type: Boolean, default: false},
    shortlinktype	: String,
    shortlinkcontent	: String,
    clicks		: Number,
    twitterclicks		: Number,
    facebookclicks		: Number,

});

var shortLink = mongoose.model('shortLink', shortLinkSchema);



// Template files
	// Tacky code but it works great so don't judge me
	// Why complicate thing when the basic stuff like this works great
var header = fs.readFileSync("./includes/header.inc", "utf8", function(err, data) { if (err) throw err; });
var footer = fs.readFileSync("./includes/footer.inc", "utf8", function(err, data) { if (err) throw err; });
var addshortlinkpage = fs.readFileSync("./includes/newshortlink.inc", "utf8", function(err, data) { if (err) throw err; });
var menu = fs.readFileSync("./includes/menu.inc", "utf8", function(err, data) { if (err) throw err; });

// The following files must be included last as they need to access the above varibles and schemas
// i.e functions and routes must be below this or else things will go very wrong
// Load functions file
var func = require('./func');

// Route setup
var loginroute = require('./routes/login');
var dashboardroute = require('./routes/dashboard');
var shortlinkroute = require('./routes/shortlink');
var shortlinksroute = require('./routes/shortlinkspage');
var shortlinkeditroute = require('./routes/shortlinkedit');
var apiroute = require('./routes/api')(app);



// Root directory
// TODO: add redirect and landing page functions
app.get('/', function(req,res){
	page = header+"error"+footer;
	res.send(page);
});

// Login Page
app.get('/admin/login', [loginroute.initlogin, loginroute.countlinks, loginroute.sendlogin]);


// Logout User
app.get('/admin/logout',function(req,res){
	req.session.user=null;
	req.session.destroy();
	res.redirect('/admin');
});

// Admin Dashboard
// TODO: Add interactivity
app.get('/admin', [dashboardroute.initdashboard, dashboardroute.addcounts, dashboardroute.senddashboard]);


// Shortlinks page
// TODO: Add pagnation at bottom
app.get('/admin/shortlinks/:pagenumber', [shortlinksroute.initshortlinkspage, shortlinksroute.makeshortlinkstable, shortlinksroute.makeshortlinkspage]);

// New shortlink page
// TODO: fix SmartLink and link types
app.get('/admin/addshortlink', function(req,res){
	session=req.session;
	if(session.user) {
		page = header+addshortlinkpage+footer;
		page = func.replaceall(page, session.user, '{currentuser}');
		page = page.replace('{menu}', menu);
		page = page.replace('{sysname}', config.systemname);
		res.send(page);
	} else {
		res.redirect('/admin/login');
	}

});

app.post('/admin/addshortlink', function(req,res){
	session=req.session;
	if(req.body.shortlink) {
		shrtlnk = req.body.shortlink;
	} else {
		shrtlnk = shortid.generate()
	}
	if(session.user) {
		var newshortlink = new shortLink({
    		shortlink    : shrtlnk,
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

// Delete Shortlink handler
// Deletes shortlinks, currently any logged in user can delete shortlinks
// TODO: Add permision system so only users who created the link or superusers can delete them
app.get('/admin/delete/:shortlink', function(req,res){
	session=req.session;
	if(session.user) {
		shortLink.findOneAndRemove({shortlink: req.params.shortlink}, function(err, result){
		if(result) {
			res.redirect('/admin/shortlinks/1');
		} else {
			// No shortlink found so redirect to homepage
			res.redirect('/');
		}
	}); 
	} else {
		res.redirect('/admin/login');
	}

});

// Login handler
// TODO: Add error responses
app.post('/login', function(req,res){
	session=req.session;
	easyLsUser.findOne({ username: req.body.user }, function(err, user) {
    	if (err) return console.error(err);
    	if(user === null) {
    		// Username not in database
    		console.log("Not in database");
    		res.redirect('/admin/login');
    	} else {
    		// We found a user, now check if thier password matches
    		if(bcrypt.compareSync(req.body.pass, user.password)) {
				session.user = req.body.user;
				res.redirect('/admin/');
			} else {
				// Password not correct ;(
				console.log("Not same password");
				res.redirect('/admin/login');
			}
    	}

	});


});
// New User Test
// This is used to create new users for testing, this needs to be improved for public release
// Solution should be a user creation wizard when you first start EasyLS with a blank database
// TODO: Remove
app.post('/new', function(req,res){
	var newuser = new easyLsUser({
    	username    : req.body.user,
    	email     : "test@test.coms",
    	password      : bcrypt.hashSync(req.body.pass)

	});
	newuser.save(function(err, newuser) {
  		if (err) return console.error(err);
	});
	res.redirect('/admin/logout');
});

// Shortlink handler
app.get('/:shortlink', [shortlinkroute.findshortlink, shortlinkroute.redirectshortlink]);



app.get('/admin/edit/:shortlinkid', [shortlinkeditroute.initshortlinkedit, shortlinkeditroute.getshortlinkpagedata, shortlinkeditroute.makeshortlinkeditpage]);

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
console.log('****************************************************************');
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
