(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Views = require('./views');

var Engine = new Backbone.Marionette.Application({container: '#app'});

Engine.addRegions({
	map: '#map',
	deck: '#deck',
	modal: '#modal'
});

Engine.addInitializer(function(options){
	var map = new Views.Map();
	Engine.map.show(map);

	var deck = new Views.Deck();
	Engine.deck.show(deck);

	Engine.on('authorized', function() {
		deck.render();
	});

	Engine.on('logout', function() {
		delete localStorage.token;

		window.isAuthorized = function() {
			return false;
		}

		window.getUser = function() {
			return null;
		}

		$.ajaxSetup({
			headers: {'x-auth-token': null }
		});
		deck.render();
	});

	deck.on('childview:showPlace', map.showPlace.bind(map));
	deck.on('authorized', function(authObject) {
		$.post('/auth', authObject).then(function(user, statusText, response) {
			if (response.status != 200) {
				return;
			}

			localStorage.token = user.token;

			window.isAuthorized = function() {
				return true;
			}

			window.getUser = function() {
				return user;
			}

			$.ajaxSetup({
				headers: {'x-auth-token': user.token }
			});
			deck.render();
		});
	})

	deck.on('logout', Engine.trigger.bind(Engine, 'logout'));

	map.on('showPlaceModal', function(place) {
		var placeModal = new Views.PlaceModal({
			model: place
		});
		Engine.modal.show(placeModal);
	});

	map.on('newPlace', function(position) {
		var addPlaceModal = new Views.AddPlaceModal({
			position: position
		});
		Engine.modal.show(addPlaceModal);
		addPlaceModal.on('cancel', function() {
			addPlaceModal.destroy();
			$('#modal-container').hide();
		});
		addPlaceModal.on('placeCreated', function(place) {
			deck.addPlace(place);
			map.drawMarker(place);
			addPlaceModal.destroy();
			$('#modal-container').hide();
		});
	});

	$('#modal-container').on('click', function(e) {
		if (e.target.id !== "modal-container") return;
		$('#modal-container').hide();
		map.clearNewPlace();
	});
	Engine.modal.on('before:show', function() {
		$('#modal-container').show();
	});
});

Engine.addInitializer(function(options){
	Backbone.history.start();
	if (localStorage.token) {
		window.isAuthorized = function() {
			return true;
		}

		$.ajaxSetup({
			headers: {'x-auth-token': localStorage.token }
		});

		$.get('/auth/me').then(function(user, statusText, response) {
			if (response.status != 200) {
				return;
			}
			window.getUser = function() {
				return user;
			}
			Engine.trigger('authorized');
		});
	}
});

(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

document.onready = function() {
	Engine.start();
}

window.fbAsyncInit = function() {
	FB.init({
		appId: window.config.facebookAppId,
		cookie: true,
		xfbml: true,
		version: 'v2.1'
	});
};
},{"./views":15}],2:[function(require,module,exports){
var Models = require('../models');

module.exports = Backbone.Collection.extend({
	model: Models.Comment,
	url: '/comments'
});
},{"../models":8}],3:[function(require,module,exports){
var Models = require('../models');

module.exports = Backbone.Collection.extend({
	model: Models.Place,
	url: '/places'
});
},{"../models":8}],4:[function(require,module,exports){
module.exports = {
	Places: require('./Places.js'),
	Comments: require('./Comments.js')
}
},{"./Comments.js":2,"./Places.js":3}],5:[function(require,module,exports){
module.exports = Backbone.Model.extend({
	url: '/comments'
});
},{}],6:[function(require,module,exports){
module.exports = Backbone.Model.extend({
	url: '/places',
	vote: function() {
		return $.when($.put('/places/' + this.id + '/vote'));
	},
	getPosition: function() {
		var position = this.get('latlng').split(':');
		return new google.maps.LatLng(position[0], position[1]);
	}
});
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
module.exports = {
	Place: require('./Place.js'),
	User: require('./User.js'),
	Comment: require('./Comment.js')
}
},{"./Comment.js":5,"./Place.js":6,"./User.js":7}],9:[function(require,module,exports){
var Place = require('../models/Place');

module.exports = Marionette.ItemView.extend({
	tagName: 'div',
	template: '#add-place-modal-template',
	className: 'addPlaceModal',
	triggers: {
		'click .cancel-button': 'cancel'
	},
	events: {
		'click .save-button': 'savePlace'
	},
	savePlace: function() {
		var that = this;
		var improvement = this.$('[data-value="name"]').val();
		var description = this.$('[data-value="description"]').val();
		var position = this.options.position;
		var place = new Place({
			improvement: improvement,
			description: description,
			latlng: position.lat() + ':' + position.lng()
		});
		place.save({}, {
			success: function() {
				that.trigger('placeCreated', place);
			},
			error: function() {
				//@TODO: handle errors
			}
		});
	}
});
},{"../models/Place":6}],10:[function(require,module,exports){
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
},{"../collections":4,"../models":8,"./OnePlace":13}],11:[function(require,module,exports){
var Collections = require('../collections');

module.exports = Marionette.ItemView.extend({
	tagName: 'div',
	className: 'mapContainer',
	template: '#map-template',
	newPlace: undefined,
	onRender: function() {
		var mapOptions = {
			center: { lat: window.config.lat, lng: window.config.lon},
			zoom: window.config.zoom,
			disableDefaultUI: true
		};
		this.map = new google.maps.Map(this.el, mapOptions);
		google.maps.event.addListener(this.map, 'click', this.mapClicked.bind(this));
		this.places = new Collections.Places();
		this.places.fetch().then(this.showMarkers.bind(this));
	},
	showMarkers: function() {
		this.places.each(this.drawMarker.bind(this));
	},
	drawMarker: function(place) {
		var marker = new google.maps.Marker({
			position: place.getPosition(),
			map: this.map
		});
		var that = this;
		google.maps.event.addListener(marker, 'click', function(e) {
			that.map.setCenter(marker.getPosition());
			that.trigger('showPlaceModal', place);
		});
	},
	showPlace: function(view) {
		var model = view.model;
		this.map.setCenter(model.getPosition());
		this.trigger('showPlaceModal', model);
	},
	mapClicked: function(e) {
		var latlng = e.latLng;
		this.map.setCenter(latlng);
		if (this.newPlace) {
			this.newPlace.setMap(null);
		}
		var marker = new google.maps.Marker({
			position: latlng,
			map: this.map
		});
		this.newPlace = marker;
		this.trigger('newPlace', latlng);
	},
	clearNewPlace: function() {
		if (!this.newPlace) return;
		this.newPlace.setMap(null);
		this.newPlace = undefined;
	}
});
},{"../collections":4}],12:[function(require,module,exports){
module.exports = Marionette.ItemView.extend({
	tagName: 'div',
	template: '#one-comment-template',
	className: 'oneComment'
});
},{}],13:[function(require,module,exports){
module.exports = Marionette.ItemView.extend({
	tagName: 'div',
	template: '#one-place-template',
	className: 'onePlace',
	triggers: {
		'click': 'showPlace'
	},
	templateHelpers: function () {
		return {
			time: function(){
				return moment(this.created_at).format('DD.MM.YYYY');
			}
		}
	}
});
},{}],14:[function(require,module,exports){
var Models = require('../models');
var Collections = require('../collections');
var OneComment = require('./OneComment');

module.exports = Marionette.CompositeView.extend({
	tagName: 'div',
	template: '#one-place-modal-template',
	className: 'onePlaceModal',
	childView: OneComment,
	collection: new Collections.Comments(),
	childViewContainer: '.comments',
	events: {
		'click .share-fb': 'shareFb'
	},
	templateHelpers: function () {
		return {
			time: function(){
				return moment(this.created_at).format('DD.MM.YYYY');
			}
		}
	},
	initialize: function() {
		this.collection.fetch({data: {placeId: this.model.get('id')}});
	},
	shareFb: function() {				
		FB.ui(
		{
			method: 'share',
			href: location.href + '#placeId=' + this.model.get('id')
		}, function(response){

		});
	}
});
},{"../collections":4,"../models":8,"./OneComment":12}],15:[function(require,module,exports){
module.exports = {
	Map: require('./Map.js'),
	Deck: require('./Deck.js'),
	PlaceModal: require('./PlaceModal.js'),
	AddPlaceModal: require('./AddPlaceModal.js')
}
},{"./AddPlaceModal.js":9,"./Deck.js":10,"./Map.js":11,"./PlaceModal.js":14}]},{},[1]);
