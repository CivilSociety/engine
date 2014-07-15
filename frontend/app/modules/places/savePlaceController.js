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