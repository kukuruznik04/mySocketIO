angular.module('hotelApp')
	.factory('chatService', ['$http', function ($http) {
		let chatService = {};

		chatService.initChannel = function (channel, email) {
			return $http({
				method: 'GET',
				url: '/hotelapi/initChannel',
				params: {channel: channel, user: email},
				headers: {}
			});
		};

		chatService.getOnlineUsers4Channel = function() {
			//console.log("get online users");
			return $http({
				method: 'GET',
				url: '/hotelapi/onlineUsers4Channel',
				headers: {}
			});
		};

		chatService.updateMsgListOnlineStatus = function(msgList, onlineUsers) {
			for (var i=0; i < msgList.length; i++)
			{
				if (onlineUsers.indexOf(msgList[i].user) > -1) {
					msgList[i].online = true;
				} else {
					msgList[i].online = false;
				}
			}
			return msgList;
		};

		chatService.storeMessage = function (newMsg) {
			console.log("store message");
			let newCollab =
				{
					experienceName: 'test experience name',
					externalRefID: newMsg.experienceId,
					typeRef: newMsg.typeRef,
					scope: {
						name: newMsg.room
					},

					comments: [{
						message: newMsg.text,
						visibility: newMsg.visibility,
						isDone: newMsg.isDone
					}]
				};
			//refID is filled in when store msg within element room
			if (newMsg.room !== 'experience manager' && newMsg.room !== 'context' && newMsg.room !== 'logistcis') {
				newCollab.scope.name = 'experience element';
				newCollab.scope.refID = newMsg.refID;
			}

			//console.log("NEW MSG " + JSON.stringify(newCollab));

			return $http({
				method: 'POST',
				url: '/mvpapi/collaboration',
				data: newCollab,
				headers: {}
			});
		};

		return chatService;
	}]);