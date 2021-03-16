
// User route file
const express = require("express");
const app = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
// Load input validation
const validateRegisterInput = require("../../auth/register");
const validateLoginInput = require("../../auth/login");
// Load User model
const User = require("../../models/User");

// @route   POST api/login
// @desc    Get User
// @access  Public
// Will grab user on login
app.post('/login', (req, res) =>{
  console.log("Logging in...");

  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // Find user by email
  User.findOne({ username: req.body.username }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ usernotfound: "Username not found" });
    }
    console.log(user);
    // Check password 
    bcrypt.compare(req.body.password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          username: user.username
        };
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });

          
      }
    });
  });
});


// @route   POST /register
// @desc    Create A User
// @access  Public
// Will create new users using the requests body name 
app.post('/register', (req, res) =>{

  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);  
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ user: req.body.username }).then(user => {
    if (user) {
      return res.status(400).json({ username: "Username already exists" });
    } else {
      const newUser = new User({
        username: req.body.username,
        password: req.body.password
      });
    

    // Hash password before saving in database
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => res.json(user))
          .catch(err => console.log(err));
      });
    });
    }
  })
  console.log("Registering...");
});

module.exports = app;