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
		zoom: config.zoom,
		minZoom: 10
	});
	var currentMarker;
	var markers = [];
	var selectionOptions = {
		fill: false,
		opacity: 0,
		weight: 3,
		color: 'darkgreen'
	};
	var selection = L.circleMarker([50.5, 30.5], selectionOptions).addTo(map);
	$scope.isAuthorized = config.token ? true : false;
	$scope.place = {};
	$rootScope.showPlace = false;

	Places.getList().then(function(data) {
		data.forEach(drawMarker);
	});

	function drawMarker(place) {
		var radius = 5;
		var dr = 2;
		var maxRadius = 30;
		var latlng = place.latlng.split(';');
		if (place.votes > 0) {
			radius += dr * place.votes;
		}
		if (radius > maxRadius) {
			radius = maxRadius;
		}
		var options = {
			color: 'green',
			fillOpacity: 1,
			radius: radius
		};
		place.date = moment(place.created_at).format('DD.MM.YYYY');

		var marker = L.circleMarker(latlng, options);
		marker.placeId = place.id;
		marker.on('mouseover', function() {
			var point = map.latLngToContainerPoint(marker.getLatLng());
			marker.setStyle({color: 'darkgreen'});
			selection.setLatLng(marker.getLatLng())
				.setRadius(marker.getRadius() + 10)
				.setStyle({opacity: 1});
			showTooltip(point, place.description, marker.getRadius());
		});
		marker.on('mouseout', function() {
			marker.setStyle({color: 'green'});
			selection.setStyle({opacity: 0});
			hideTooltip();
		});

		marker.on('click', function() {
			$rootScope.$broadcast('moveMap', place);
		});

		marker.addTo(map);
		markers.push(marker);


		var placeId = getParameterByName('place_id');
		if (placeId && placeId === place.id) {
			$rootScope.$broadcast('moveMap', place);
		}
	}
	
	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a rel="nofollow" href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	map.setMaxBounds(config.resctictions);	

	map.on('click', function(e) {
		hideTooltip();
		if (!currentMarker) {
			currentMarker = L.marker(e.latlng).addTo(map);			
		} else {
			currentMarker.setLatLng(e.latlng);
		}
		currentMarker.setOpacity(1);
		$rootScope.currentMarker = currentMarker;
		$('#add-place-form').show();
		$scope.latlng = currentMarker.getLatLng();
	});

	$rootScope.$on('moveMap', function(e, place) {	
		map.panTo(place.latlng.split(';'));
		markers.forEach(function(m) {
			if (m.placeId === place.id) {
				$rootScope.currentPlace = place;
				var point = map.latLngToContainerPoint(m.getLatLng());
				$rootScope.showPlace = true;
				showModal(point, 'show-one-place');
			}
		});
	});

	$rootScope.$on('placeAdded', function(e, place) {
		drawMarker(place);
		place.votes = 0;
		$rootScope.places.unshift(place);
		currentMarker.closePopup();
		currentMarker.setOpacity(0);
	});
}
]);

function showTooltip(coords, text, radius) {
	var tooltip = document.getElementById('place-tooltip');
	tooltip.style.left = coords.x + radius + 30 + 'px';
	tooltip.innerHTML = text;
	tooltip.style.top = coords.y  - tooltip.offsetHeight/2 + 'px';
}
function showModal(coords, modalId) {
	var modal = document.getElementById(modalId);
	modal.style.left = coords.x - 30 - modal.offsetWidth + 'px';
	modal.style.display = 'block';
	modal.style.top = coords.y  - modal.offsetHeight/2 + 'px';
}
function hideTooltip() {
	var tooltip = document.getElementById('place-tooltip');
	tooltip.style.display = 'none';
}

function getParameterByName(name) {
    var hash = location.hash;
    if (hash.indexOf('?') === -1) return null;
    var params = {};
    hash.split('?').slice(1).pop().split('&').forEach(function(s) {
    	var pair = s.split('=');
    	params[pair[0]] = pair[1];
    });
    return params[name];
}
})();