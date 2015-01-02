var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	text: String,
	placeId: String,
	userId: String,
	userName: String,
	date: {type: Date, default: Date.now}
});

var model = mongoose.model('comment', schema);
module.exports = model;