
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
app.post('/getMyBoards', (req, res) =>{
  console.log("Getting user board data");
  // Find user by email
  Board.find({ userId: req.body.userId })
  .then(myBoards => {
      console.log(myBoards);
      res.status(200).json({
          boardData: myBoards
      })
  })
  .catch(err => console.log(err));
});

app.post('/createBoard', (req, res) =>{
    console.log("Making a new board");
    console.log(req.body.userId);
   const newBoard = new Board({
            b1: [{
                  x0: 0,
                  y0: 0,
                  x1: 50,
                  y1: 39,
                  color: "black",
            }],
            b2: [{
                  x0: 50,
                  y0: 39,
                  x1: 100,
                  y1: 100,
                  color: "red",
            }],
        
        lastModified: Date.now(),
        userId: req.body.userId
    });

    newBoard.save()
        .then(newBoard => res.json(newBoard))
        .catch(err => console.log(err));
         
    console.log("Adding..." + newBoard);
});

module.exports = app;