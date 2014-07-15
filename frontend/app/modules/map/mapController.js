;(function() {
'use strict';

angular.module('civil').controller('mapController', [
'config',
'$rootScope',
'$scope',
'$compile',
'Places',
function(config, $rootScope, $scope, $compile, Places) {
	var map = L.map('map', {
		center: [config.lat, config.lon],
		zoom: config.zoom
	});
	var currentMarker;
	$scope.place = {};

	Places.getList().then(function(data) {
		data.forEach(drawMarker);
	});

	function drawMarker(place) {
		var linkFunction = $compile(angular.element(document.getElementById('place-doc').innerHTML));
		var newScope = $scope.$new();
		newScope.place = place;
		var votes = window.localStorage.getItem('votes');
		newScope.canVote = !(votes && votes.indexOf(place.id) != -1);

		newScope.vote = function(p) {
			if (typeof window.localStorage.getItem('votes') != 'Object') {
				window.localStorage.setItem('votes', [p.id]);
			} else {
				window.localStorage.getItem('votes').push(p.id);
			}
			Places.get(p.id).customPUT('vote').then(function() {
				newScope.canVote = false;
			});
		}

		L.circleMarker(place.latlng.split(';')).bindPopup(linkFunction(newScope)[0]).addTo(map);
	}
	
	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a rel="nofollow" href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
	map.setMaxBounds(config.resctictions);	
	map.on('click', function(e) {
		if (!currentMarker) {
			currentMarker = L.marker(e.latlng).addTo(map);			
		} else {
			currentMarker.setLatLng(e.latlng);
		}
		currentMarker.setOpacity(1);
		var linkFunction = $compile(angular.element(document.getElementById('creation-form').innerHTML));
		var newScope = $scope.$new();
		newScope.latlng = currentMarker.getLatLng();
		currentMarker.bindPopup(linkFunction(newScope)[0], {minWidth: 500}).openPopup();
		currentMarker.getPopup().closeOnClick = false;
		currentMarker.getPopup().on('close', function() {
			currentMarker.setOpacity(0);
		});
	});

	$rootScope.$on('moveMap', function(e, place) {	
		map.panTo(place.latlng.split(';'));
	});
}
]);

})();