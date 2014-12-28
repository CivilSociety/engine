var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	text: String,
	placeId: String,
	userId: String,
	userName: String
});

var model = mongoose.model('comment', schema);
module.exports = model;