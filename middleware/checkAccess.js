function checkAccess(req, res, next) {
	if (!res) {
		var roles = req;
		return function(req, res, next) {
			var user = req.getUser();
			if (roles.indexOf(user.role) === -1) {
				return res.status(403).end();	
			}
			next();
		}
	} else {
		if (!req.getUser().isAuthorized()) {
			return res.status(403).end();
		}
		next();
	}
}

module.exports = checkAccess;