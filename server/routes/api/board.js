
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
    console.log("my user id is: " + req.body.userId)

    Board.find({})
    .then(myBoards => {
        var keys = Object.keys(myBoards);
        res.status(200).json({
            boardData: myBoards,
            length: keys
        }) 
    })
    .catch(err => console.log(err));
});

app.post('/getBoard', (req, res) =>{
    Board.find({_id: req.body.boardId })
    .then(myBoard => {
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
    
        console.log(JSONify(res.newBoard))
    console.log("Creating a new board for: " + req.body.userId);
});

app.post('/saveBoard', async (req, res) =>{
    let oldBoard = await Board.findById(req.body.boardId).exec();
    let data = [req.body.boardState]

    for (let i in data) {
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