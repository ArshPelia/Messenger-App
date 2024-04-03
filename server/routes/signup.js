const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
require('../models/user');
const mongoose = require('mongoose');

const User = mongoose.model('User');



/* GET signup page. */
router.get('/', function(req, res, next) {
  res.render('signup', {});
});

// Validation and sanitization middleware
const validateSignUp = [
  body('username').trim().isLength({ min: 1 }).escape().withMessage('username must be specified'),
  body('lastName').trim().isLength({ min: 1 }).escape().withMessage('Last name must be specified'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  // body('confirmPassword').custom((value, { req }) => {
  //   if (value !== req.body.password) {
  //     throw new Error('Passwords do not match');
  //   }
  //   return true;
  // }),
];

// Route to handle signup form submission
router.post('/', validateSignUp, async (req, res) => {
  console.log('Form Submitted')

  // Extract validation errors, if any
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Hash the password using bcryptjs
  const hashedPassword = await bcryptjs.hash(req.body.password, 10);
  console.log('Hashed password:', hashedPassword); // Add this line for logging

  // Create a new user object with sanitized and hashed data
  const user = new User({
    username: req.body.username,
    last_name: req.body.lastName,
    email: req.body.email,
    status: 'Non-Member',
    password: hashedPassword,
  });

  // Save the user to the database
  try {
    const savedUser = await user.save();
    console.log('User saved:', savedUser);
    // Store the user information in the session
    req.session.currentUser = savedUser;
    res.redirect('/messageboard');
  } catch (err) {
    console.error('Error saving user:', err);
    res.status(500).json({ error: 'An error occurred while saving the user' });
  }
});

module.exports = router;
