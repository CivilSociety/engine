(function() {
angular.module('civil').controller('SavePlaceController', [
'config',
'$scope',
'$rootScope',
'Places',
function(config, $scope, $rootScope, Places) {
	$scope.isAuthorized = config.token ? true : false;
	$scope.save = function() {
		$scope.place.latlng = [$scope.latlng.lat, $scope.latlng.lng].join(';');
		$scope.place.votes = 0;		
		Places.post($scope.place).then(function(place) {
			$rootScope.$broadcast('placeAdded', place);
		});
		$scope.place = {};
		return false;
	}
	$scope.close = function() {
		$('#add-place-form').hide();
		$('#add-place-form').find('input').val('');
		$('#add-place-form').find('textarea').val('');
		$rootScope.currentMarker.setOpacity(0);
	}
}
]);
})();