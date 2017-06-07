angular
	.module('hotelApp')
	.controller('loginController', ['$scope', '$state', 'loginService', function ($scope, $state, loginService) {

		$scope.login = {};
		$scope.login.username = '';

		let channel = '/login';
		let room = '1';
		let socket = io().connect();

		$scope.submitForm = function () {
			loginService.initChannel(channel, $scope.login.username)
				.then(function (response) {
					socket = io(channel).connect();
					$state.go('feedback');
					connectToRoom(room);
				}, function (response) {
					console.log(response);
				})
		};

		function connectToRoom(room) {
			// channel could have multiple rooms
			socket.emit('connect:room', {
				room: room,
				user: $scope.login.username
			});
		}
	}]);