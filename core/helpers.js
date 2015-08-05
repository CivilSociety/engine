var _ = require('lodash');
var mongoose = require('mongoose');
module.exports = {
	randomString: function (string_length) {
		return Math.random().toString(33).substr(2, string_length);
	},

	simpleOkResponse: function (res, err) {
		return function (err) {
			if (err) {
				return res.json(err);
			}
			return res.status(200).end();
		}
	},

	simpleCollectionResponse: function (res) {
		return function (err, collection) {
			if (err) {
				return res.json(err);
			}
			var result = [];
			for (var i = 0, l = collection.length; i < l; i++) {
				result.push(simplifyObject(collection[i]));
			}
			return res.json(result);
		}
	},

	simpleObjectResponse: function (res) {
		return function (err, object) {
			if (err) {
				return res.json(err);
			}
			return res.json(simplifyObject(object));
		}
	},

	simpleCreatedResponse: function (res) {
		return function(err, object) {
			if (err) {
				return res.json(err);
			}
			return res.status(201).json(simplifyObject(object));
		}
	}
}

function simplifyObject(object) {
	if (object instanceof mongoose.Document) {
		object = object.toJSON();
	}
	if (object._id) {
		object.id = object._id;
	}
	return _.omit(object, '_id', '__v', 'password', 'salt');
}
