const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

//framework of node js to simply the making of api
const app = express();

//using cors for cross origin communication
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

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
  
//requeest send from the login form handling
app.get('/login', (req, res) => {
    console.log(req.query);  
  LoginAuthenticate.findOne({ username: req.query.username })
    .then(user => {
    if (user) {
        console.log("User found");
        // Perform actions for successful authentication
        res.status(200).json({ message: "Authentication successful", success: true });
      } else {
        console.log("User not found");
        // Perform actions for unsuccessful authentication
        res.status(404).json({ message: "Authentication failed", success: false });
      }
    })
    .catch(error => {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  });
});


//this is the port on which the server site runs
app.listen(3002, () => {
  console.log('Server running on port 3002');
});
