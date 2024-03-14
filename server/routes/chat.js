// chat.js
var express = require('express');
var router = express.Router();

/* GET chat page. */
router.get('/', function(req, res, next) {
  // Assuming you have some data for messages and online users
  var messages = [
    { username: "User 1", text: "Message 1" },
    { username: "User 2", text: "Message 2" },
    { username: "User 3", text: "Message 3" }
  ]; // Example messages
  var onlineUsers = ["User 1", "User 2", "User 3"]; // Example online users

  // Render the chat EJS template and pass the data
  res.render('chat', { 
    title: 'Chat',
    messages: messages,
    onlineUsers: onlineUsers
  });
});

module.exports = router;
