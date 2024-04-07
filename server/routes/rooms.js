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

module.exports = router;