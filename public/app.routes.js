angular
	.module('hotelApp')
	.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {

		$stateProvider
			.state('feedback', {
				url: '/feedback',
				templateUrl: 'components/feedback/feedback.view.html'
			})
			.state('login', {
				url: '/login',
				templateUrl: 'components/account/login.view.html'
			})
			.state('messages', {
				url: '/messages',
				templateUrl: 'components/contacts/messages.view.html'
			});

		$urlRouterProvider.otherwise('/login');
		// $locationProvider.html5Mode(true);

	}]);