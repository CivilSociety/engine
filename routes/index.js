var express = require('express');
var router = express.Router();
var conf = require('../config');

router
	.get('/', function (req, res) {
		res.render('index', conf.publicConstants);
	})
	.get('/translations', getTranslations);

var routes = {
	index: router,
	places: require('./places')
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
