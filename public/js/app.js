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
(function() {
	angular.module('civil').directive('hoverClass', function () {
    return {
        restrict: 'A',
        scope: {
            hoverClass: '@'
        },
        link: function (scope, element) {
            element.on('mouseenter', function() {
                element.addClass(scope.hoverClass);
            });
            element.on('mouseleave', function() {
                element.removeClass(scope.hoverClass);
            });
        }
    };
})
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
	var markers = [];
	$scope.place = {};

	Places.getList().then(function(data) {
		data.forEach(drawMarker);
	});

	function drawMarker(place) {
		var linkFunction = $compile(angular.element(document.getElementById('place-doc').innerHTML));
		var newScope = $scope.$new();
		var options = {
			color: 'green',
			fillOpacity: 0.5,
			radius: 15
		};
		var votes = window.localStorage.votes || '';
		votes = votes.split(',');
		newScope.place = place;
		newScope.canVote = (votes.indexOf(place.id) === -1);

		newScope.vote = function(p) {
			//debugger;
			var votes = window.localStorage.votes || '';
			votes = votes.split(',') || [];
			if (votes.indexOf(place.id) !== -1)  return;
			votes[votes.length] = place.id;
			window.localStorage.votes = votes.join(',');
			Places.one(p.id).customPUT({}, 'vote').then(function() {
				p.votes++;
				newScope.canVote = false;
			});
		}
		var marker = L.circleMarker(place.latlng.split(';'), options);
		marker.placeId = place.id;
		marker.on('mouseover', function() {
			marker.setStyle({fillOpacity: 1});
		});
		marker.on('mouseout', function() {
			marker.setStyle({fillOpacity: 0.5});
		});
		marker.bindPopup(linkFunction(newScope)[0]).addTo(map);
		markers.push(marker);


		var placeId = getParameterByName('place_id');
		console.log(placeId)
		if (placeId && placeId === place.id) {
			$rootScope.$broadcast('moveMap', place);
		}
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
		markers.forEach(function(m) {
			if (m.placeId === place.id) {
				m.openPopup();
			}
		});
	});

	$rootScope.$on('placeAdded', function(e, place) {
		drawMarker(place);
		$rootScope.places.push(place);
		currentMarker.closePopup();
		currentMarker.setOpacity(0);
	});
}
]);

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
;(function() {
'use strict';

angular.module('civil').controller('SidebarController', [
'config',
'$scope',
'Places',
'$rootScope',
function(config, $scope, Places, $rootScope) {
	$scope.name = config.name;
	$rootScope.places = [];
	Places.getList().then(function(places) {
		places.forEach(function(place) {
			place.date = moment(place.created_at).format('DD.MM.YYYY');
		});
		$rootScope.places = places;
	});;
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
		Places.post($scope.place).then(function(place) {
			$rootScope.$broadcast('placeAdded', place);
		});
		$scope.place = {};
		return false;
	}
}
]);
})();