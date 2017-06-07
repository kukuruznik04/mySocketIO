angular
	.module('hotelApp')
	.factory('loginService', ['$http', function ($http) {
		let loginService = {};

		loginService.initChannel = function(channel, email){
			return $http({
				method: 'GET',
				url:'/hotelapi/initChannel',
				params: {channel: channel, user: email},
				headers: {}
			});
		};

		return loginService;
	}]);