
// User route file
const express = require("express");
const app = express.Router();
// Load input validation
// Load canvas model
const Board = require("../../models/board");

/*
    * @route   POST api/getMyBoards
    * @desc    Get Boards
    * @access  Public
    * Will grab the boards based on the user Id
    
*/
app.post('/getMyBoards', (req, res) =>{
  Board.find({ userId: req.body.userId })
  .then(myBoards => {
      console.log("For the user: " + req.body.userId + "\n These were found: " + myBoards);
      res.status(200).json({
          boardData: myBoards
      })
  })
  .catch(err => console.log(err));
});

app.post('/createBoard', (req, res) =>{
   const newBoard = new Board({
        boardData: [],
        lastModified: Date.now(),
        createdAt: Date.now(),
        ownerId: req.body.userId,
        contributors: []
    });

    newBoard.save()
        .then(newBoard => res.json(newBoard))
        .catch(err => console.log(err));
         
    console.log("Creating a new board for: " + req.body.userId);
});

module.exports = app;