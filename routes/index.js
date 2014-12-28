var express = require('express');
var router = express.Router();
var conf = require('../config');
var fs = require('fs');

router
	.get('/', function (req, res) {
		var token = req.query.token;
		var params = conf.publicConstants;
		var templates = 
		params.token = token;
		params.isAuthorized = false;
		params.templates = fs.readFileSync('./public/templates.html');
		res.render('index', params);
	})
	.get('/translations', getTranslations);

var routes = {
	index: router,
	places: require('./places'),
	comments: require('./comments'),
	auth: require('./auth')
};

module.exports = routes;

function getTranslations(req, res) {
	var locale = req.params.locale;
	var locales = ['us_US', 'ru_RU'];

	if (locales.indexOf(locale) === -1) {
		return res.sendfile('locales/us_US.json');	
	}
	res.sendfile('locales/' + locale + '.json');
}
