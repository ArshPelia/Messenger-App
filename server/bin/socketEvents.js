// socketEvents.js
const socketIO = require('socket.io');

function initializeSocket(server) {
    const io = socketIO(server);

    io.on('connection', (socket) => {
        console.log('A user connected');

        // Handle other socket events here
        // Join a room
    socket.on('joinRoom', (room) => {

        console.log(`${socket.id} just joined room ${room}`);

        socket.join(room);

        io.to(room).emit('roomJoined', `${socket.id} just joined the room`);
    });

    // Leave a room
    socket.on('leaveRoom', (room) => {
        console.log(`${socket.id} has left room ${room}`);
    
        socket.leave(room);
    
        io.to(room).emit('roomLeft', `${socket.id} has left the room`);
    });


    // Post a message to a specific room
    socket.on('messageToRoom', (data) => {

        console.log(`${socket.id} posted a message to room ${data.room}: ${data.message}`);
        
        io.to(data.room).emit('message', {
        id: socket.id,
        message: data.message
        });

    });


    // Send a message to all connected clients
    socket.on('messageToAll', (data) => {
        console.log(`${socket.id} sent a message to all clients: ${data.message}`);
        
        io.emit('message', {
        id: socket.id,
        message: data.message
        });  

    });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
}

module.exports = initializeSocket;
