//@TODO: refactor all this shit
var FB = require('fb');
var User = require('../models/user');
var Session = require('../core/session');
var _ = require('lodash');
var config = require('../config');
var crypto = require('crypto');

exports.auth = auth;
exports.me = me;
exports.logout = logout;

function logout(req, res) {
	req.session.remove(function(err) {
		if (err) {
			return res.status(500).end();
		}
		res.status(200).end();
	});
}

function me(req, res) {
	res.json(req.getUser().getData());
}

function auth(req, res, next) {
	console.log('start auth controller');
	if (!req.body) {
		return res.status(400).json({error: 'Wrong request'});
	}
	var source = req.body.source;
	if (!source) {
		return res.status(400).json({error: 'Wrong request'});
	}


	if (source === 'fb') {
		var accessToken = req.body.response.authResponse.accessToken;
		if (!accessToken) {
			return res.status(400).json({error: 'Wrong request'});
		}
		FB.api('me', {access_token: accessToken}, function(fbUser) {
			if (fbUser.error) {
				return res.status(401).end(fbUser.error);
			}
			User.findOne({$or: [{facebookId: fbUser.id}, {email: fbUser.email}]}, function(err, user) {
				if (err) {
					return res.status(500).end();
				}
				if (!user) {
					createUser(fbUser, 'fb');
				} else {
					authUser(user);
				}
			});
		});
	} else if (source === 'vk') {
		console.log('vk source checked');
		var response = req.body.response;
		var sid = response.session.sid;
		var sig = response.session.sig;
		var clientId = config.vk.clientID;
		var appSecret = config.vk.clientSecret;
		var checkString = "expire=" + response.session.expire
			+ "mid=" + response.session.mid
			+ "secret=" + response.session.secret
			+ "sid=" + sid + appSecret;
		var cryptedCheckString = crypto.createHash('md5').update(checkString).digest("hex");
		console.log(cryptedCheckString);
		console.log(sig);
		if (cryptedCheckString !== sig) {
			return res.status(401).end('wrong secret');
		}
		var vkUser = response.session.user;
		vkUser.name = vkUser.first_name + ' ' + vkUser.last_name;
		console.log('look for user');
		User.findOne({$or: [{vkId: vkUser.id}, {email: vkUser.email}]}, function(err, user) {
			if (err) {
				console.log(err);
				return res.status(500).end('internal error');
			}
			if (!user) {
				createUser(vkUser, 'vk');
			} else {
				authUser(user);
			}
		});
	}

	function createUser(data, type) {
		if (type === 'vk') {
			data.profileUrl = data.href;
			data.vkId = data.id;
		}
		if (type === 'fb') {
			data.profileUrl = data.link;
			data.facebookId = data.id;
		}
		var user = new User(data);
		user.save(function(err, user) {
			if (err) {
				return res.status(500).end('internal error');
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
				console.log(err);
				return res.status(500).end();
			}
			var result = session.toJSON();
			result.token = data.token;
			res.json(result);
		});
	}
}