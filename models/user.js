var mongoose = require('mongoose');
var helpers = require('../core/helpers');
var crypto = require('crypto');

var schema = new mongoose.Schema({
	name: String,
	/*email: {
		type:String,
		unique: true,
		required: true,
		set: setEmail
	},
	password: {
		type:String,
		required: true,
		set: setPassword
	},*/
	vkontakteId: String,
	facebookId: String,
	avatar: String,
	profileUrl: String,
	/*salt: {
		type:String,
		default: generateSalt
	},*/
	role: {type: Number, default: 1}
});

schema.statics.generatePassword = generatePassword;

schema.statics.passwordIsValid = function(user, password) {
	return generatePassword(password, user.salt) === user.password;
}

function generateSalt() {
	return helpers.randomString(30);
}

function setPassword(password) {
	this.salt = generateSalt();
	return generatePassword(password, this.salt);
}

function setEmail(email) {
	return email.toLowerCase().trim();
}

function generatePassword(pass, salt) {
	var h = crypto.createHash('sha512');
	h.update(pass);
	h.update(salt);
	return h.digest('base64');
}

var model = mongoose.model('user', schema);

model.ROLE_MODERAtOR = 1;
model.ROLE_USER = 2;

module.exports = model;