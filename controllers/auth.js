//@TODO: refactor all this shit
var FB = require('fb');
var User = require('../models/user');
var Session = require('../core/session');
var _ = require('lodash');

exports.auth = auth;
exports.me = me;

function me(req, res) {
	res.json(req.getUser().getData());
}

function auth(req, res, next) {
	if (!req.body) {
		return res.status(400).json({error: 'Wrong request'});
	}
	var source = req.body.source;
	if (!source) {
		return res.status(400).json({error: 'Wrong request'});
	}
	var accessToken = req.body.response.authResponse.accessToken;
	if (!accessToken) {
		return res.status(400).json({error: 'Wrong request'});
	}

	FB.api('me', {access_token: accessToken}, function(fbUser) {
		if (fbUser.error) {
			return res.status(401).end(fbUser.error);
		}
		User.findOne({facebookId: fbUser.id}, function(err, user) {
			if (err) {
				return res.status(500).end();
			}
			if (!user) {
				createUser(fbUser);
			} else {
				authUser(user);
			}
		});
	});

	function createUser(data) {
		var user = new User({
			facebookId: data.id,
			email: data.email,
			name: data.name,
			profileUrl: data.link
		});
		user.save(function(err, user) {
			if (err) {
				return res.status(500).end();
			}
			authUser(user);
		});
	}

	function authUser(user) {
		var data = _.pick(user, ['name', 'profileUrl', 'avatar']);
		data.id = user._id.toString();
		var session = new Session(data);
		session.save(function(err, data) {
			if (err) {
				return res.status(500).end();
			}
			var result = session.toJSON();
			result.token = data.token;
			res.json(result);
		});
	}
}