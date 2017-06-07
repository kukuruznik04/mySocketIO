// modules =================================================
let express        = require('express'),
	app            = express(),
	router 		   = express.Router(),
	mongoose       = require('mongoose'),
	bodyParser     = require('body-parser'),
	methodOverride = require('method-override'),
	config 		   = require('config'),
	hoteldb 	   = require('./config/hoteldb'),
	sass 		   = require('node-sass-middleware'),
	https 		   = require('https'),
	path 		   = require('path');

module.exports.router = router;
module.exports.hoteldbConn = hoteldb.myConnection;

// schemas
let feedback = module.exports.feedback = require('./models/feedback.js').feedback;

// configuration

// config files
let hotelconfig = require('./config/hotelconfig.js'); // not used for now

// Enable CORS
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Apikey");
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, OPTION, PUT, PATCH, DELETE');
	next();
});

//sass dynamic autocompiler
app.use(sass({
	src: path.join(__dirname, '/public/sass'),
	dest: path.join(__dirname, '/public/css'),
	outputStyle: 'expanded',
	debug: true,
	prefix: '/css'
}));
app.use(express.static(__dirname + '/public'));

// all environments
app.set('port', config.env.port);
app.set('httpport', config.env.httpport);
app.set('env', config.env.node_env);
// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT

// start app
// app.listen(app.get('httpport'));
let http = require('http').Server(app);
let server = http.listen(app.get('httpport'), function(){
	console.log('Magic happens on port ' + app.get('httpport'));
});
module.exports.server = server;

// all routes
app.use('/hotelapi', router);

// routes
require('./hotel-api/feedback.routes.js');
require('./hotel-api/chat.routes.js');



module.exports.app = app; 						// expose app