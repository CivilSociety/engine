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
			map: this.map,
			icon: 'public/images/mark.png'
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
		var img = 'public/images/mark.png';
		var marker = new google.maps.Marker({
			position: latlng,
			map: this.map,
			icon: img
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
