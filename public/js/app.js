;(function() {
'use strict';

angular.module('civil').config([
'$stateProvider', '$urlRouterProvider', 'RestangularProvider', 'config',
function ($stateProvider, $urlRouterProvider, RestangularProvider, config) {

	$urlRouterProvider.otherwise('/');
	$stateProvider
		.state('map', {
			url: '/',
			templateUrl: '/modules/map/index.html',
			controller: 'mapController'
		});

	RestangularProvider.setBaseUrl(config.apiUrl);
}
]);

})();
;(function() {
'use strict';

angular.module('civil').controller('mapController', [
'config',
'$rootScope',
function(config, $rootScope) {
	console.log(config);
	var map = L.map('map', {
		center: [config.lon, config.lat],
		zoom: config.zoom,
		maxBounds: config.restrictions
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

	$rootScope.$on('moveMap', function(e, place) {	
		map.panTo(place.latlng.split(';'));
	});
}
]);

})();
;(function() {
'use strict';

angular.module('civil').controller('SidebarController', [
'config',
'$scope',
'Places',
'$rootScope',
function(config, $scope, Places, $rootScope) {
	$scope.name = config.name;
	$scope.places = Places.getList().$object;
	$scope.isDetailedViewHidden = true;
	$scope.isLogoHidden = false;
	$scope.showDetails = function() {
		$scope.isDetailedViewHidden = false;
		$scope.isLogoHidden = true;
	}

	$scope.hideDetails = function() {
		$scope.isDetailedViewHidden = true;
		$scope.isLogoHidden = false;
	}
}
]);

})();
(function() {
	angular.module('civil').directive('place', [
		'$rootScope',
		function($rootScope) {
		return {
			restrict: 'E',
			templateUrl: 'modules/places/placeDerictive.html',
			controller: function($scope) {
				$scope.moveMap = function(place) {
					$rootScope.$broadcast('moveMap', place);
				}
			}
		}
	}]);
})();
(function() {
	angular.module('civil').factory('Places', ['Restangular', function(Restangular) {
		return Restangular.service('places');
	}]);
})();