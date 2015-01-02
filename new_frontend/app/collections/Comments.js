var Models = require('../models');

module.exports = Backbone.Collection.extend({
	model: Models.Comment,
	url: '/comments',
	comparator: function(comment) {
		return -(new Date(comment.get('date'))).valueOf();
	}
});