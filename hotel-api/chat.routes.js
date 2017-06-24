let router = module.exports.router = module.parent.exports.router;
let server = module.exports.server = module.parent.exports.server;
let io = require('socket.io')(server);



// namespace list initialization to avoid duplicates
let nspList = [];
// list of connected users per experience / room
let connectedUsers = [];
let rooms = [];



router.use(function (req, res, next) {
	// do logging
	next(); // make sure we go to the next routes and don't stop here
});

router.get('/onlineUsers4Channel', function (req, res) {
	// get online users on specific namespace & room
	// var onlineUsers = [];
	// for (var i = 0; i < connectedUsers.length; i++) {
	//
	// 	if (onlineUsers.indexOf(connectedUsers[i].username) === -1) {
	// 		onlineUsers.push(connectedUsers[i].username);
	// 	}
	// }
	// console.log("online users " + onlineUsers);
	res.send(connectedUsers);
});

router.get('/checkUserOnline', function (req, res) {
	// get online users on specific namespace & room
	var online = false;

	for (var i = 0; i < connectedUsers.length; i++) {
		if (connectedUsers[i].username === req.query.username) {
			online = true;
			break;
		}
	}

	res.send(online);
});

router.get('/initChannel', function (req, res) {

	let namespace = req.query.channel;

	if (nspList.indexOf(namespace) > -1)
	{
		console.log('Channel already exist.');
		res.send('Channel already exist.');
	} else 
	{
		let nsp = io.of(namespace);
		nspList.push(namespace);

		console.log('Channel successfully created.');
		res.send('Channel successfully created.');

		nsp.on('connection', function(socket){
			let user = req.query.username;
			console.log('User connected');
			//console.log(socket);

			socket.on('disconnect', function(){
				console.log('User disconnected');
				//connectedUsers.splice(connectedUsers.indexOf(user), 1);
			});

			// join the chat room
            socket.on('connect:room', function (data, cb) {

                // current rooms for the channel
                let isRoom = false;
                for (let i=0; i<rooms.length; i++) {
                    if(rooms.socket === socket && data.room === rooms[i].room) {
                        isRoom = true;
                    }
                }
                if (isRoom === false) {
                    console.log('added room ' + data.room + ' on channel ');
                    rooms.push({socket: socket, room: data.room});
                }

                socket.join(data.room, function (err) {
                	console.log(socket.rooms);
                	if (err)
                    	console.log("Cannot connect to the chat room. See logs details " + err);
					// socket.to('room number', 'a new user has joined the room'); // broadcast to everyone in the room
                });
				socket.join(data.username, function (err) {
					console.log(socket.rooms);
					if (err)
						console.log("Cannot connect to the self chat room. See logs details " + err);
				});
                let connectedUser = data;
                let isThere = false;
                if (connectedUsers.length > 0) {
                    for (let i = 0; i < connectedUsers.length; i++) {
                        if (connectedUsers[i].username === data.username) {
                            isThere = true;
                            console.log("user is there " + connectedUser.username);
                        }
                    }
                }
                if (isThere === false) {
					//connectedUser.socketId = socket.id;
                    connectedUsers.push(connectedUser);
                    console.log("user is NOT there " + connectedUser.username);
                    console.log("connectedUsers :" + JSON.stringify(connectedUsers));
                    for (let i=0; i < rooms.length; i++) {
                        console.log('connect broadcast to room ' + rooms[i].room);
                        rooms[i].socket.broadcast.to(rooms[i].room).emit('user:connect', {
							username: data.username,
                            text: 'has connected the chat room.' + data.room,
                            room: data.room
                        });
                    }
                }
				cb && cb();
            });

			// leave the chat room
			socket.on('leave:room', function (data) {
				socket.leave(data.room);
				if (data.disconnect) {
					for (let i=0; i < rooms.length; i++) {
						console.log('disconnect broadcast to room ' + rooms[i].room);
						rooms[i].socket.broadcast.to(rooms[i].room).emit('user:disconnect', {
							username: data.username,
							text: 'has left the chat room.' + data.room,
							room: data.room
						});
					}
					// remove user's rooms
					for (let i = 0; i < rooms.length; i++) {
						if (rooms[i].socket === socket) {
							console.log('removed room ' + rooms[i].room);
							rooms.splice(i, 1);
						}
					}
					// remove user from connectedUsers
					removeUserFromChannel(data);
				}
			});

			// chat message sent
			// broadcast a user's message to other users
			socket.on('send:message', function (data) {
				console.log('send:message: ' + data.text + ' from: ' + data.username + ' chat room: ' + data.room);
				//io.sockets.emit('send:message', {   <--- send to everybody
				socket.broadcast.to(data.room).emit('send:message', {
					username: data.username,
					firstname: data.firstname,
					lastname: data.lastname,
					text: data.text,
					date: data.date,
					room: data.room,
					visibility: data.visibility,
					isDone: data.isDone
				});
			});

			// chat message sent
			// broadcast a user's message to other users
			socket.on('send:private:message', function (data) {
				console.log('send:message: ' + data.text + ' from: ' + data.username + ' chat room: ' + data.room + ' to: ' + data.to);
				//io.sockets.emit('send:message', {   <--- send to everybody
				socket.broadcast.to(data.to).emit('send:private:message', {
					username: data.username,
					firstname: data.firstname,
					lastname: data.lastname,
					text: data.text,
					date: data.date,
					room: data.room,
					visibility: data.visibility,
					isDone: data.isDone
				});
			});

			// chat message sent
			// broadcast a user's message to other users
			socket.on('send:message:confirmation', function (data) {
				console.log('send:message: ' + data.text + ' from: ' + data.username + ' chat room: ' + data.room);
				//io.sockets.emit('send:message', {   <--- send to everybody
				socket.broadcast.to(data.room).emit('send:message:confirmation', {
					text: data.text
				});
			});
		})
	}


});


function removeUserFromChannel(user) {
	// remove user
	if (connectedUsers.length > 0) {
		for (let i = 0; i < connectedUsers.length; i++) {
			if (connectedUsers[i].username === user.username) {
				console.log('Removed user from online users for channel: ' + JSON.stringify(user));
				connectedUsers.splice(i, 1);
				console.log("connectedUsers :" + JSON.stringify(connectedUsers));
			}
		}
	}
}