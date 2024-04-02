// routes/login.js

const express = require('express');
const passport = require('passport');
const router = express.Router();

// GET request for the sign-in page
router.get('/', function(req, res, next) {
  // Render the sign-in page
  res.render('login', {  });
});

console.log('logging in')
// POST request for user sign-in
router.post('/', passport.authenticate('local', {
  
  successRedirect: '/', // Redirect to the home page on successful authentication
  failureRedirect: '/login', // Redirect back to the sign-in page on authentication failure
//   failureFlash: true // Enable flash messages for failed authentication
}));

module.exports = router;
