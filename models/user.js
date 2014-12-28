var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: String,
	email: String,
	vkontakteId: String,
	facebookId: String,
	avatar: String,
	profileUrl: String
});


var model = mongoose.model('user', schema);

module.exports = model;