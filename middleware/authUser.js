var session = require('../core/session');
function authUser(req, res, next) {
	var token = req.headers['x-auth-token'];
	if (!token) {
		req.getUser = function() {
			return createGuestUser();
		}
		return next();
	}
	session.restoreByToken(token, function(err, session) {
		if (err) return next(err);
			req.getUser = function() {
			return creatAuthorizedUser(session);
		}
		return next();
	});
}
module.exports = authUser;

function creatAuthorizedUser(s) {
	var session = s;
	return {
		isGuest: function() {
			return false;
		},
		isAuthorized: function() {
			return true;
		},
		getData: function() {
			return session.toJSON();
		}
	}
}

function createGuestUser() {
	return {
		isGuest: function() {
			return true;
		},
		isAuthorized: function() {
			return false;
		},
		getData: function() {
			return {};
		}
	}
}