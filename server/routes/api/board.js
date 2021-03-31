
// User route file
const express = require("express");
const app = express.Router();
// Load input validation
// Load canvas model
const Board = require("../../models/board");

// @route   POST api/login
// @desc    Get User
// @access  Public
// Will grab user on login
app.get('/getBoard', (req, res) =>{
  console.log("Getting board data");

  // Find user by email
  Board.find().then(boardData => {
      console.log(boardData);
  })
});

app.post('/createBoard', (req, res) =>{
    console.log("Making a new board");
    console.log(req.body.id);
   const newBoard = new Board({
        boardData: [], 
        lastModified: Date.now(),
        userId: req.body.id
    });

    newBoard.save()
        .then(user => res.json(user))
        .catch(err => console.log(err));
         
    console.log("Adding...");
});

module.exports = app;