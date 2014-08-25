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
	$scope.isDetailedViewHidden = true;
	$scope.isLogoHidden = false;
	$scope.loaded = false;
	$scope.showDetails = function() {
		$scope.isDetailedViewHidden = false;
		$scope.isLogoHidden = true;
	}

	$scope.hideDetails = function() {
		$scope.isDetailedViewHidden = true;
		$scope.isLogoHidden = false;
	}
	$scope.showPopular = function() {
		$scope.loaded = false;
		Places.getList({order: '-votes'}).then(function(places) {
			places.forEach(function(place) {
				place.date = moment(place.created_at).format('DD.MM.YYYY');
			});
			$rootScope.places = places;
			$scope.loaded = true;
		});;
	}
	$scope.showNew = function() {
		$scope.loaded = false;
		Places.getList().then(function(places) {
			places.forEach(function(place) {
				place.date = moment(place.created_at).format('DD.MM.YYYY');
			});
			$rootScope.places = places;
			$scope.loaded = true;
		});;
	}
	$scope.showNew();
}
]);

})();