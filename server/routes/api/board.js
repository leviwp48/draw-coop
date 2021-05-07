
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
      console.log(myBoards)
      //console.log("For the user: " + req.body.userId + "\n These were found: " + myBoards);
      var keys = Object.keys(myBoards);
      //console.log(keys.length)
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
        //console.log("Board Id: " + req.body.boardId + " \nand the board is: " + myBoard)
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
        ],
        lastModified: Date.now(),
        createdAt: Date.now(),
        ownerId: req.body.userId,
        contributors: [],
        image: ''
    });

    newBoard.save()
        .then(newBoard => res.json(newBoard))
        .catch(err => console.log(err));
         
    console.log("Creating a new board for: " + req.body.userId);
});

app.post('/saveBoard', async (req, res) =>{
    console.log("here")
    let oldBoard = await Board.findById(req.body.boardId).exec();
    //console.log(oldBoard)
    let data = [req.body.boardState]
    //console.log(data)

    for (let i in data) {
        //console.log(data[i])
        oldBoard.boardData.push(...data[i])
    }

    Board.findByIdAndUpdate(req.body.boardId, {boardData: oldBoard.boardData, lastModified: Date.now(), image: req.body.image}, function(err, res) {
        if (err) {
            console.log(err);
        }
        else{
            //console.log(JSON.stringify(res)) 
        } 
    });
    res.status(200).send("Updated Board")
});

module.exports = app;