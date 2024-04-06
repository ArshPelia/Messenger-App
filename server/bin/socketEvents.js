// socketEvents.js
const socketIO = require('socket.io');

function initializeSocket(server) {
  const io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  const users = [];

  io.on("connection", socket => {
      socket.on("adduser", username => {
        socket.user = username;
        users.push(username);
        io.sockets.emit("users", users);
        console.log(`user ${socket.user} is connected`);
    
        io.to(socket.id).emit("private", {
          id: socket.id,
          name: socket.user,
          msg: "secret message",
        });
      });
    
      socket.on("message", message => {
        console.log(`message from ${socket.user}: ${message}`);
        io.sockets.emit("message", {
          message,
          user: socket.user,
          id: socket.id,
        });
      });
    
      socket.on("disconnect", () => {
        console.log(`user ${socket.user} is disconnected`);
        if (socket.user) {
          users.splice(users.indexOf(socket.user), 1);
          io.sockets.emit("user", users);
          console.log("remaining users:", users);
        }
      });
    });
  }

module.exports = initializeSocket;
