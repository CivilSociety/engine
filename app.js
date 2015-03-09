var express = require('express');
var bodyParser = require('body-parser');
var middleware = require('./middleware');
var routes = require('./routes/index');
var mongoose = require('mongoose');
var config = require('./config');
var app = express();

mongoose.connect(config.db.connectionString, {server: {auto_reconnect: true}});
app.use('/public', express.static(__dirname + '/public'));
app.use('/modules', express.static(__dirname + '/public/modules'));
app.set('views', './views');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(allowCrossDomain);
app.use(middleware.authUser);
app.options('*', function (req, res) {
    res.end();
});

app.use('/', routes.index);
for (var route in routes) {
	if (routes.hasOwnProperty(route) && route != 'index') {
		app.use('/' + route, routes[route]);
	}
}

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});

function allowCrossDomain(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, x-auth-token');
	next();
}

module.exports = app;