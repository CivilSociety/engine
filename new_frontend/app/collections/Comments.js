var Models = require('../models');

module.exports = Backbone.Collection.extend({
	model: Models.Comment,
	url: '/comments'
});