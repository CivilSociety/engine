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