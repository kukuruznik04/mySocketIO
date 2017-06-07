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
			let user = req.query.user;
			console.log('User connected');

			socket.on('disconnect', function(){
				console.log('User disconnected');
				//connectedUsers.splice(connectedUsers.indexOf(user), 1);
			});

			// join the chat room
            socket.on('connect:room', function (data) {

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
                    console.log("Cannot connect to the chat room. See logs details");
					// socket.to('room number', 'a new user has joined the room'); // broadcast to everyone in the room
                });
                let connectedUser = data;
                let isThere = false;
                if (connectedUsers.length > 0) {
                    for (let i = 0; i < connectedUsers.length; i++) {
                        if (connectedUsers[i].user === data.user) {
                            isThere = true;
                            console.log("user is there " + connectedUser.user);
                        }
                    }
                }
                if (isThere === false) {
                    connectedUsers.push(connectedUser);
                    console.log("user is NOT there " + connectedUser.user);
                    console.log("connectedUsers :" + JSON.stringify(connectedUsers));
                    for (let i=0; i < rooms.length; i++) {
                        console.log('connect broadcast to room ' + rooms[i].room + ' ' +rooms[i].experienceId);
                        rooms[i].socket.broadcast.to(rooms[i].room).emit('user:connect', {
                            user: data.user,
                            text: 'has connected the chat room.' + data.room,
                            room: data.room
                        });
                    }
                }
            });

			// leave the chat room
			socket.on('leave:room', function (data) {
				socket.leave(data.room);
				if (data.disconnect) {
					for (let i=0; i < rooms.length; i++) {
						console.log('disconnect broadcast to room ' + rooms[i].room);
						rooms[i].socket.broadcast.to(rooms[i].room).emit('user:disconnect', {
							user: data.user,
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
		})
	}


});


function removeUserFromChannel(user) {
	// remove user
	if (connectedUsers.length > 0) {
		for (let i = 0; i < connectedUsers.length; i++) {
			if (connectedUsers[i].user === user.user) {
				log.debug('Removed user from online users for channel: ' + JSON.stringify(user));
				connectedUsers.splice(i, 1);
				log.debug("connectedUsers :" + JSON.stringify(connectedUsers));
			}
		}
	}
}