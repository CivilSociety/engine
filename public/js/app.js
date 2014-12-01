(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Views = require('./views');

var Engine = new Backbone.Marionette.Application({container: '#app'});

Engine.addRegions({
	map: '#map',
	deck: '#deck'
});

Engine.addInitializer(function(options){
	var map = new Views.Map();
	Engine.map.show(map);

	var deck = new Views.Deck();
	Engine.deck.show(deck);
});

Engine.addInitializer(function(options){
  //new MyAppRouter();
	Backbone.history.start();
});
document.onready = function() {
	console.log('starting');
	Engine.start();
}
},{"./views":10}],2:[function(require,module,exports){
var Models = require('../models');

module.exports = Backbone.Collection.extend({
	model: Models.Place,
	url: '/places'
});
},{"../models":6}],3:[function(require,module,exports){
module.exports = {
	Places: require('./Places.js')
}
},{"./Places.js":2}],4:[function(require,module,exports){
module.exports = Backbone.Model.extend({
	url: '/places',
	vote: function() {
		return $.when($.put('/places/' + this.id + '/vote'));
	}
});
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
module.exports = {
	Place: require('./Place.js'),
	User: require('./User.js')
}
},{"./Place.js":4,"./User.js":5}],7:[function(require,module,exports){
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
	}

});
},{"../collections":3,"../models":6,"./OnePlace":9}],8:[function(require,module,exports){
module.exports = Marionette.ItemView.extend({
	tagName: 'div',
	className: 'mapContainer',
	template: '#map-template',
	onRender: function() {
		var mapOptions = {
			center: { lat: -34.397, lng: 150.644},
			zoom: 8
		};
		var map = new google.maps.Map(this.el, mapOptions);
	}
});
},{}],9:[function(require,module,exports){
module.exports = Marionette.ItemView.extend({
	tagName: 'div',
	template: '#one-place-template',
	className: 'onePlace',
	events: {
		"click": "showPlace"
	},
	templateHelpers: function () {
		return {
			time: function(){
				return moment(this.created_at).format('DD.MM.YYYY');
			}
		}
	},
	showPlace: function(e) {
		console.log(e)
	}
});
},{}],10:[function(require,module,exports){
module.exports = {
	Map: require('./Map.js'),
	Deck: require('./Deck.js')
}
},{"./Deck.js":7,"./Map.js":8}]},{},[1]);
