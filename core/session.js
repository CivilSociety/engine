var helpers = require('../core/helpers.js');
var mongoose = require('mongoose');

var SessionSchema = new mongoose.Schema({
	token: String,
	date: {type: Date, default: Date.now},
	data: Object
});

var SessionModel = mongoose.model('Session', SessionSchema);

var Session = function (data) {
	var me = this;
	if (data) {
		this.data = data;
	} else {
		this.token = helpers.randomString(30) + (new Date()).valueOf();
		this.data = {};
	}

	this.set = function (key, value) {
		if (typeof value === 'object') value = value.toString();
		me.data[key] = value;
	}

	this.save = function (callback) {
		var modifier = {$set: {}};
		modifier.$set.data = me.data;
		SessionModel.findOneAndUpdate({token: me.token}, modifier, {upsert: true}, callback);
	}

	this.toJSON = function () {
		return me.data;
	}

	this.remove = function (callback) {
		SessionModel.remove({token: me.token}, callback);
	}
}

Session.restoreByToken = function (token, callback) {
	SessionModel.findOne({token: token}, function (err, data) {
		if (data === null) {
			return callback(err, null);
		}
		var session = new Session(data.data);
		session.token = token;
		return callback(err, session);
	});
}

module.exports = Session;