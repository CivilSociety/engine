module.exports = Backbone.Model.extend({
	url: '/places',
	vote: function() {
		return $.when($.put('/places/' + this.id + '/vote'));
	}
});