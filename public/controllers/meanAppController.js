var meanApp = angular.module('meanApp', []);
meanApp.controller('meanAppCtrl', ['$scope', '$http', function($scope, $http) {

	var refresh = function() {
		$http.get('/personsList').success(function(response) {
			$scope.personsList = response;
		});
	};

	refresh();
	
	$scope.addPerson = function() {
		$http.post('/addPerson', $scope.person).success(function(response) {
			refresh();
			$scope.person = "";
		});
	};

	$scope.deletePerson = function(id) {
		$http.delete('/deletePerson/'+id).success(function(response) {
			refresh();
		});
	};

	$scope.editPerson = function(id) {
		$http.get('/editPerson/'+id).success(function(response) {
			$scope.person = response;
		});
	}

	$scope.updatePerson = function() {
		$http.put('/updatePerson/'+$scope.person._id, $scope.person).success(function(response) {
			refresh();
			$scope.person = "";
		});
	}
}]);