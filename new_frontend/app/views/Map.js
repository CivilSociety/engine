var Collections = require('../collections');

module.exports = Marionette.ItemView.extend({
	tagName: 'div',
	className: 'mapContainer',
	template: '#map-template',
	onRender: function() {
		var mapOptions = {
			center: { lat: window.config.lat, lng: window.config.lon},
			zoom: window.config.zoom,
			disableDefaultUI: true
		};
		this.map = new google.maps.Map(this.el, mapOptions);
		this.places = new Collections.Places();
		this.places.fetch().then(this.showMarkers.bind(this));
		this.handleMapEvents();
	},
	showMarkers: function(places) {
		places.forEach(this.drawMarker.bind(this));
	},
	drawMarker: function(place) {
		var position = place.latlng.split(';');
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(position[0], position[1]),
			map: this.map
		});
		var that = this;
		google.maps.event.addListener(marker, 'click', function(e) {
			that.map.setCenter(marker.getPosition());
			that.trigger('map:showPlaceModal', place);
		});
	},
	showPlace: function() {
		debugger;
	},
	handleMapEvents: function() {

	}
});