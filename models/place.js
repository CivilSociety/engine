var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: String,
	improvement: String,
	description: String,
	created_at: {type: Date, default: Date.now},
	votes: {type: Number, default: 0},
	latlng: String,
	denied: {type: Boolean, default: false},
	moderated: {type: Boolean, default: false}
});

var model = mongoose.model('place', schema);
module.exports = model;