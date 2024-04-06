var express = require('express');
var router = express.Router();

/* GET chat page. */
router.get('/', function(req, res, next) {
  //retrive current user set in app.js as res.locals.currentUser
  const currentUser = res.locals.currentUser;
  res.render('rooms', { 
    title: 'Chatrooms',
    currentUser: currentUser.fname,
    rooms: res.locals.rooms,
  });
});


router.get('/joinroom', function(req, res, next) {
  //retrive current user set in app.js as res.locals.currentUser
  const currentUser = res.locals.currentUser;
  console.log(currentUser + " joined room");

  // Render the chat EJS template and pass the data
  res.render('chat', { 
    title: 'Chat',
    currentUser: currentUser.fname,
  });

});

module.exports = router;