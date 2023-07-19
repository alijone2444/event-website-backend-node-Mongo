const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy; // Add this line to import LocalStrategy
//framework of node js to simply the making of api
const app = express();
const passport = require("passport");
const session = require('express-session');





// Connect to MongoDB using Mongoose middleware / package
mongoose.connect('mongodb+srv://alijone2333:rqgxCTarBj3TX6Bi@cluster1.rbjs7ls.mongodb.net/EventWebDb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
  });
// Create a schema for login
const loginSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  });
  const LoginAuthenticate = mongoose.model('AuthenticateUsers', loginSchema, 'AuthenticateUsers');
  




//using cors for cross origin communication
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(passport.initialize());
app.use(session({
  secret: 'my-event-secret-key', // Replace with your actual secret key
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
//auth function
passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await LoginAuthenticate.findOne({ username: username });
        if (!user) return done(null, false);
        const isMatch = await LoginAuthenticate.findOne({ username: username ,password:password});
        if (!isMatch)
          return done(null, false);
        // if passwords match return user
        return done(null, user);
      } catch (error) {
        console.log(error)
        return done(error, false);
      }
    }
  )
);



//requeest send from the login form handling
app.get('/login', passport.authenticate('local-login'),(req, res) => {
    console.log(req.query);  console.log(req.session);
    res.send({success:true})
});





//this is the port on which the server site runs
app.listen(3002, () => {
  console.log('Server running on port 3002');
});
