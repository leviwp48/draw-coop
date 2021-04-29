
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
  Board.find({ ownerId: "test" })
  .then(myBoards => {
      console.log("For the user: " + req.body.userId + "\n These were found: " + myBoards);
      var keys = Object.keys(myBoards);
      console.log(keys.length)
      res.status(200).json({
          boardData: myBoards,
          length: keys
      })
      
      
  })
  .catch(err => console.log(err));
});

app.post('/getBoard', (req, res) =>{
    Board.find({ ownerId: "test", _id: req.body.boardId })
    .then(myBoard => {
        console.log("Board Id: " + req.body.boardId + " \nand the board is: " + myBoard)
        res.status(200).json({
            boardData: myBoard
        })        
    })
    .catch(err => console.log(err));
});

app.post('/createBoard', (req, res) =>{
   const newBoard = new Board(
       {
        boardData:[
            [90, 20, 10, 100, "red"],
            [70, 100, 25, 100, "red"],
            [20, 110, 25, 100, "blue"],
            [40, 140, 25, 100, "black"],
            [70, 100, 35, 100, "yellow"],
            [43, 100, 45, 120, "orange"],
            [70, 190, 75, 130, "green"]
        ],
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