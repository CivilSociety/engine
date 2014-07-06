;(function() {
'use strict';

angular.module('civil').controller('mapController', [
'config',
function(config) {
	var map = L.map('map', {
		center: [config.lon, config.lat],
		zoom: config.zoom
	});
	var currentMarker;
	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a rel="nofollow" href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	map.on('click', function(e) {
		if (!currentMarker) {
			currentMarker = L.marker(e.latlng).addTo(map);			
		} else {
			currentMarker.setLatLng(e.latlng);
		}
		currentMarker.setOpacity(1);
		currentMarker.bindPopup(document.getElementById('creation-form').innerHTML, {minWidth: 500}).openPopup();
		currentMarker.getPopup().closeOnClick = false;
		currentMarker.getPopup().on('close', function() {
			currentMarker.setOpacity(0);
		});
	});
}
]);

})();