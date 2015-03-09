var Models = require('../models');
var Collections = require('../collections');
var OnePlace = require('./OnePlace');

module.exports = Marionette.CompositeView.extend({
	template: "#deck-template",
	model: new Models.User(),
	childView: OnePlace,
	collection: new Collections.Places(),
	childViewContainer: '.places',
	events: {
		'click [data-role="logout"]': 'logout'
	},
	logout: function() {
		var that = this;
		$.post('/auth/logout').then(function(data, responseText, response) {
			that.trigger('logout');
		});
	},
	initialize: function() {
		this.collection.fetch();
	},
	addPlace: function(place) {
		this.collection.add(place);
		this.render();
	},
	updatePlace: function(place) {
		this.collection.findWhere({'id': place.id}).set('votes', place.votes)
		this.render();
	},
	onRender: function() {
		var that = this;

		this.$('#facebook-auth').on('click', function() {
			
			FB.getLoginStatus(function(response) {
				if (response.status === 'connected') {
					that.trigger('authorized', {source: 'fb', response: response});
				} else {
					FB.login(function(response){
						if (response.status === 'connected') {
							that.trigger('authorized', {source: 'fb', response: response});
						}
					});
				}
			});
		});

		this.$('#vk-auth').on('click', function() {
			VK.Auth.login(function(response) {
				if (response.status === 'connected') {
					that.trigger('authorized', {source: 'vk', response: response});
				}
			}, 'email');
		});
		if (isAuthorized()) {
			if (!this.model.get('id')) {
				this.model.set(getUser());
				this.render();
			}
			this.$('.auth-buttons').hide();
		} else {
			this.$('.user-data').hide();
			this.$('[data-role="logout"]').hide();
		}
	}

});