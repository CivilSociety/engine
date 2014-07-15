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
(function() {
angular.module('civil').controller('SavePlaceController', [
'$scope',
'$rootScope',
'Places',
function($scope, $rootScope, Places) {
	$scope.save = function() {
		$scope.place.latlng = [$scope.latlng.lat, $scope.latlng.lng].join(';');
		Places.post($scope.place).then(function(exp) {
			$scope.places.push(exp);
		});
		$scope.place = {};
		return false;
	}
}
]);
})();