var Models = require('../models');
var Collections = require('../collections');
var OnePlace = require('./OnePlace');

module.exports = Marionette.CompositeView.extend({
	template: "#deck-template",
	model: new Models.User(),
	childView: OnePlace,
	collection: new Collections.Places(),
	childViewContainer: '.places',
	initialize: function() {
		this.collection.fetch();
	},
	onRender: function() {
		var that = this;
		if (isAuthorized()) {
			return this.$('.auth-buttons').hide();
		}
		this.$('#facebook-auth').on('click', function() {
			
			FB.login(function(response){
				console.log(response)
				if (response.status === 'connected') {
					that.trigger('authorized', {source: 'fb', response: response});
				}
			  // Handle the response object, like in statusChangeCallback() in our demo
			  // code.
			});
		});
	}

});