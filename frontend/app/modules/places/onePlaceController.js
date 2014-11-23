angular.module('civil').controller('OnePlaceController', [
'config',
'$scope',
'$rootScope',
'Places',
function(config, $scope, $rootScope, Places) {
	$scope.close = function() {
		$rootScope.showPlace = false;
	}
	$scope.canVote = false;//(votes.indexOf(place.id) === -1);
	$scope.vote = function(p) {
		Places.one(p.id).customPUT({}, 'vote').then(function() {
			p.votes++;
		});
	}	
}
]);