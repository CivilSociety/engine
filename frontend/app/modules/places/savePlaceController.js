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