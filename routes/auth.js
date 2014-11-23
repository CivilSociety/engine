var express = require('express');
var passport = require('passport');
var Session = require('../core/session');

module.exports = express.Router()
	.get('/vkontakte', passport.authenticate('vkontakte'))
	.get('/vkontakte/callback', passport.authenticate('vkontakte', { failureRedirect: '/' }),
	  function(req, res) {
			new Session(req.user).save(function(err, session) {
				res.redirect('/?token=' + session.token);
		    });
	  });