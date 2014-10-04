var request = require('request').defaults({json: true});
var config = require('../config');

var	email = config.credentials.email,
	password = config.credentials.password,
	clubId = config.credentials.clubId,
	registerUrl = config.url + '/users';


var mongoose = require('mongoose'),
	User = require('../models/user');

function removeTestUser(callback) {
	User.remove({email: email}, function(err, number) {
		callback();
	});
}

module.exports = {
	removeTestUser: removeTestUser,

	createUser: function (headers, callback) {
		removeTestUser(function() {
			var user = config.credentials;
			request.post({
				url: registerUrl,
				body: {user: user}}, auth);

			function auth(err) {
				request.post({
					url: registerUrl + '/auth',
					body: user
				}, checkUser);
			}

			function checkUser(err, res, body) {
				if (!res){
					return callback('cant create user');
				}
				headers['x-auth-token'] = body.token;
				return callback();
			}
		});
	}
}