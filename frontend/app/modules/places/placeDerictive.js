(function() {
	angular.module('civil').directive('place', [
		'$rootScope',
		function($rootScope) {
		return {
			restrict: 'E',
			templateUrl: 'modules/places/placeDerictive.html',
			controller: function($scope) {
				$scope.moveMap = function(place) {
					_zeo.push(['customEvent', 'open place from sidebar']);
					$rootScope.$broadcast('moveMap', place);
				}
			}
		}
	}]);
})();