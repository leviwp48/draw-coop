
// User route file
const express = require("express");
const app = express.Router();
// Load input validation
// Load canvas model
const Canvas = require("../../models/Canvas");

// @route   POST api/login
// @desc    Get User
// @access  Public
// Will grab user on login
app.get('/getcanvas', () =>{
  console.log("Getting canvas data");

  // Find user by email
  Canvas.find().then(canvasData => {
      console.log(canvasData);
  })
});

app.post('/newcanvas', () =>{
    console.log("making a new canvas");
    //build canvas object
    const newCanvas = new Canvas({
        canvasData: ["12", "10", "1", "5"],
        lastModified: "12:00pm"
    });

    newCanvas.save()
          .then(user => res.json(user))
          .catch(err => console.log(err));
         
    console.log("Adding...");
});

module.exports = app;