// create the controller and inject Angular's $scope
angular
	.module('hotelApp')
	.controller('feedbackController',  ['$scope', 'feedbackService', function($scope, feedbackService) {

	// Retrieve experiences per role
	feedbackService.getFeedbacks()
		.then(function (response) {
			if (response) {
				$scope.feedbackList = response.data;
			}
		}, function (err) {
			console.log("get feedback failed " + err);
		});

}]);

