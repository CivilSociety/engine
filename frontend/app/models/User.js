module.exports = Backbone.Model.extend({
	url: '/users',
	auth: function(email, password) {
		var url = '/auth';
		return $.when($.post({
			url: url,
			body: {
				email: email,
				password: password
			}
		}));
	}
});