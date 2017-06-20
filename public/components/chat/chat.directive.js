angular.module('hotelApp')
	.directive('chatDirective', function () {
		return {
			restrict: 'E',
			controller: chatDirectiveController,
			controllerAs: 'cc',
			scope: {},
			templateUrl: 'components/chat/chat.template.html'
		}
	})
	.directive('chatSlideRight', function () {
		return {
			restrict: 'AC',
			link: function (scope, element, attrs) {
				element.addClass("slideRight");
				//setup slide animation

				// angular.element(document.getElementById("collab-toggle")).on("click", function()
				// {
				// 	element.toggleClass("slideLeft");
				// });

			}
		};
	});

chatDirectiveController.$inject = ['$scope', '$localStorage', 'chatService'];

function chatDirectiveController($scope, $localStorage, chatService) {

	let cc = this;

	cc.onlineUsers = [];
	cc.msgList = [];
	cc.currentRoom = '1';

	let channel = '/feedback';
	let room = '1';
	let socket = io().connect();

	chatService.initChannel(channel, $localStorage.username)
		.then(function (response) {
			socket = io(channel).connect();
			connectToRoom(room);

			chatService.getOnlineUsers4Channel()
				.then(function (data) {
					console.log(data);
					if (data === undefined) {
						cc.onlineUsers = [];
					} else {
						cc.onlineUsers = data.data;
					}

					if (cc.onlineUsers.indexOf(cc.user) === -1) {
						cc.onlineUsers.push($localStorage.username);
					}
				}, function (response) {
					console.log("couldn't retrieve user status");
				});

			socket.on('user:connect', function (data) {
				//update msgList with new user status
				console.log('user:connect received : ' + data.user);
				if (data.user !== cc.user) {
					if (cc.onlineUsers.indexOf(data.user) === -1) {
						console.log('user:connect received : updates are done');
						cc.onlineUsers.push(data.user);
						cc.msgList = chatService.updateMsgListOnlineStatus(cc.msgList, cc.onlineUsers);
					}
				}
			});

			socket.on('user:disconnect', function (data) {
				//update msgList with new user status
				console.log('user:disconnect received : ' + data.user);
				if (data.user !== cc.user) {
					if (cc.onlineUsers.indexOf(data.user) >= 0) {
						console.log('user:disconnect received : updates are done');
						cc.onlineUsers.splice(cc.onlineUsers.indexOf(data.user), 1);
						cc.msgList = chatService.updateMsgListOnlineStatus(cc.msgList, cc.onlineUsers);
					}
				}
			});

			socket.on('send:message2', function (data) {
				cc.msgList.push(data);
				console.log(cc.msgList);
			});
		}, function (response) {
			console.log(response);
		});

	function connectToRoom(room) {
		// channel could have multiple rooms
		socket.emit('connect:room', {
			room: room,
			user: $localStorage.username
		});
	}

	cc.sendMessage = function () {
		if (cc.message === '') {
			//sharedDataService.openErrorModal('sm', true, {'title':'Collaboration warning','instructions':'Please leave a comment before sending.'});

		} else {
			var d = new Date();
			var timestamp = d.toJSON();

			cc.newMsg =
				{
					room: cc.currentRoom,
					user: $localStorage.username,
					text: cc.message,
					date: timestamp
				};


			socket.emit('send:message', cc.newMsg);

			cc.msg = '';
		}
	};

	cc.leaveRoom = function (room, disconnect) {
		socket.emit('leave:room', {
			room: room,
			user: cc.user,
			disconnect: disconnect
		});
	};

	cc.deleteMsg = function (msgList, index) {
		msgList.splice(index, 1);
	}

}
