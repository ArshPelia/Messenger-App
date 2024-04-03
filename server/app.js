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
const signUpRouter = require('./routes/signup');
const messageBoardRouter = require("./routes/messageboard");
const chatRouter = require("./routes/chat");
const bcryptjs = require("bcryptjs");

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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configure the local strategy for username/password authentication
// Passport configuration

passport.use(
  new LocalStrategy(async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        console.log('incorrect user')
        return done(null, false, { message: "Incorrect username" });
      }
      bcryptjs.compare(password, user.password, (err, res) => {

        console.log('incorrect pw' + user.password)
        if (res) {
          return done(null, user);
        }

        return done(null, false, { message: "Incorrect password" });
      });
    } catch (err) {
      return done(err);
    }
  }),
);

// Serialize and deserialize user
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    console.log('Deserializing user:', user);

    done(null, user);
  } catch (err) {
    done(err);
  };
});

// Set up session middleware
app.use(session({
  secret: 'your-secret-key', // Change this to a random string
  resave: false,
  saveUninitialized: false
}));
// Configure Passport.js for authentication
app.use(passport.initialize());
app.use(passport.session());

// Set locals.user
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});


// Middleware to check authentication
function requireAuth(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('User authenticated. Proceeding to next middleware.');
    res.locals.currentUser = req.user;
    return next();
  } else {
    console.log('User not authenticated. Redirecting to login page.');
    res.redirect('/login');
  }
}

// Routes
// Allow access to the login/signup route without authentication
app.use('/login', loginRouter); 
app.use('/signup', signUpRouter);

// Logout route
app.get("/log-out", (req, res, next) => {
  req.logout(); // Remove the callback function
  console.log('User logged out');
  res.redirect("/login");
});


// Apply requireAuth middleware to all other routes
app.use(requireAuth);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/messageboard", messageBoardRouter);
app.use("/chat", chatRouter);


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
