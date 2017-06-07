
angular
	.module('hotelApp')
	.factory('feedbackService', ['$http', function($http) {

	let feedbackService = {};

	feedbackService.getFeedbacks = function(){
		console.log("Calling feedback Service");

		return $http({
			method: 'GET',
			url: '/hotelapi/feedback',
			data: {},
			headers: {}
		});

	};

	return feedbackService;

}]);
