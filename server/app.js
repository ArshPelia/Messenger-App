require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');

// Import the User model
const User = require('./models/user');

const app = express();


// Link stylesheet
app.use('/public', express.static('public'));


// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.mongoDB;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
  console.log("MongoDB connected successfully!");
}


// Set up session middleware
app.use(session({
  secret: 'your-secret-key', // Change this to a random string
  resave: false,
  saveUninitialized: false
}));

// Configure Passport.js for authentication
app.use(passport.initialize());
app.use(passport.session());

// Custom middleware to track current user
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  // console.log('Current User Saved: '+ res.locals.currentUser);
  next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Log session information
app.use((req, res, next) => {
  console.log('Session:', req.session);
  next();
});

// Configure the local strategy for username/password authentication
passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('Authenticating user:', username);
    // Replace this with your actual authentication logic, e.g., querying the database
    User.findOne({ username: username }, function(err, user) {
      if (err) { 
        console.error('Error during authentication:', err);
        return done(err); 
      }
      if (!user) {
        console.log('User not found:', username);
        return done(null, false, { message: 'Incorrect username.' });
      }
      // Compare the provided password with the hashed password stored in the database
      user.comparePassword(password, function(err, isMatch) {
        if (err) { 
          console.error('Error comparing passwords:', err);
          return done(err); 
        }
        if (isMatch) {
          console.log('User authenticated:', username);
          return done(null, user);
        } else {
          console.log('Incorrect password:', username);
          return done(null, false, { message: 'Incorrect password.' });
        }
      });
    });
  }
));

// Serialize and deserialize user
passport.serializeUser(function(user, done) {
  console.log('Serializing user:', user.username);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('Deserializing user:', id);
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Middleware to check authentication
function requireAuth(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('User authenticated. Proceeding to next middleware.');
    return next();
  } else {
    console.log('User not authenticated. Redirecting to login page.');
    res.redirect('/login');
  }
}

// Routes
app.use('/login', loginRouter); // Allow access to the login route without authentication

// Apply requireAuth middleware to all other routes
app.use(requireAuth);

app.use('/', indexRouter);
app.use('/users', usersRouter);


// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Log the error
  console.error('Error occurred:', err);

  // render the error page
  res.status(err.status || 500);
  res.render('error', { message: err.message, errstat: err.status });
});

module.exports = app;
