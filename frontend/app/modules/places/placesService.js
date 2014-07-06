(function() {
	angular.module('civil').factory('Places', ['Restangular', function(Restangular) {
		return Restangular.service('places');
	}]);
})();