angular
	.module('hotelApp')
	.controller('loginController', ['$scope', '$state', 'loginService', '$localStorage', function ($scope, $state, loginService, $localStorage) {
		$scope.submitForm = function () {
			$localStorage.username = $scope.username;
			$state.go('feedback');
		};
	}]);