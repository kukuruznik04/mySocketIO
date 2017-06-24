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

chatDirectiveController.$inject = ['$scope', '$localStorage', 'chatService', '$location', '$q'];

function chatDirectiveController($scope, $localStorage, chatService, $location, $q) {

	let cc = this;

	cc.onlineUsers = [];
	cc.msgList = [];
	cc.currentRoom = '1';

	let channel = $location.path();
	let room = '1';
	let socket = io().connect();

	chatService.initChannel(channel, $localStorage.username)
		.then(function (response) {
			socket = io(channel).connect();
			connectToRoom(room);

			socket.on('user:connect', function (data) {
				//update msgList with new user status
				console.log('user:connect received : ' + data.username);
				if (data.username !== cc.username) {
					if (cc.onlineUsers.indexOf(data.username) === -1) {
						console.log('user:connect received : updates are done');
						cc.onlineUsers.push(data);
						if (!$scope.$$phase) {
							$scope.$apply();
						}
						//cc.msgList = chatService.updateMsgListOnlineStatus(cc.msgList, cc.onlineUsers);
					}
				}
			});

			socket.on('connect:room', function (data) {
				console.log(data);
			});

			socket.on('user:disconnect', function (data) {
				//update msgList with new user status
				console.log('user:disconnect received : ' + data.username);
				if (data.username !== cc.username) {
					if (cc.onlineUsers.indexOf(data.username) >= 0) {
						console.log('user:disconnect received : updates are done');
						cc.onlineUsers.splice(cc.onlineUsers.indexOf(data.username), 1);
						//cc.msgList = chatService.updateMsgListOnlineStatus(cc.msgList, cc.onlineUsers);
					}
				}
			});

			socket.on('send:message', function (data) {
				cc.msgList.push(data);
				console.log(cc.msgList);
				if (!$scope.$$phase) {
					$scope.$apply();
				}
				socket.emit('send:message:confirmation', {
					username: data.username,
					text: data.text,
					date: data.date,
					room: data.room
				});
			});

			socket.on('send:private:message', function (data) {
				cc.msgList.push(data);
				console.log(cc.msgList);
				if (!$scope.$$phase) {
					$scope.$apply();
				}
			});

			socket.on('send:message:confirmation', function (data) {
				//console.log(data);
			});
		}, function (response) {
			console.log(response);
		});

	function connectToRoom(room) {
		// channel could have multiple rooms
		socket.emit('connect:room', {
			room: room,
			username: $localStorage.username
		}, getOnlineUsers4Channel);
	}

	function getOnlineUsers4Channel() {
		chatService.getOnlineUsers4Channel()
			.then(function (data) {
				console.log(data.data);
				if (data === undefined) {
					cc.onlineUsers = [];
				} else {
					cc.onlineUsers = data.data;
				}

				// if (cc.onlineUsers.indexOf(cc.user) === -1) {
				// 	cc.onlineUsers.push({username:$localStorage.username, socketId:socket.id});
				// }
			}, function (response) {
				console.log("couldn't retrieve user status");
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
					username: $localStorage.username,
					text: cc.message,
					date: timestamp
				};


			socket.emit('send:message', cc.newMsg);

			cc.msg = '';
		}
	};

	cc.sendPrivateMessage = function (username) {
		if (cc.message === '') {
			//sharedDataService.openErrorModal('sm', true, {'title':'Collaboration warning','instructions':'Please leave a comment before sending.'});

		} else {
			var d = new Date();
			var timestamp = d.toJSON();

			cc.newMsg =
				{
					room: cc.currentRoom,
					username: $localStorage.username,
					text: cc.message,
					date: timestamp,
					to: username
				};


			socket.emit('send:private:message', cc.newMsg);

			//cc.message = '';
		}
	};

	cc.leaveRoom = function (room, disconnect) {
		socket.emit('leave:room', {
			room: room,
			username: cc.username,
			disconnect: disconnect
		});
	};

	cc.deleteMsg = function (msgList, index) {
		msgList.splice(index, 1);
	}

}
