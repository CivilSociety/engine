;(function() {
'use strict';

angular.module('civil').controller('SidebarController', [
'config',
'$scope',
'Places',
function(config, $scope, Places) {
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