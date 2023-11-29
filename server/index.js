const express = require('express');
const app = require("express")();
const http = require("http")
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require("passport");

const usersRoutes = require("./routes/api/users");
const boardRoutes = require("./routes/api/board");
const defaultRoutes = require("./routes/index")
const formatMessage = require("./utils/message");

const server = http.createServer(app);
const PORTNUM = process.env.PORT || 3001;

require('dotenv').config();



// TODO: create correct user login by authenticating on the back end then storing a token on the front end

// DB Config
const uri = process.env.MONGO_URI || require('./config/keys').mongoURI;

mongoose
.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    db = mongoose.connection;
    console.log('Connected to draw-coop databse...')
  })
  .catch(err => console.log(err));

// To avoid the error msg here: https://mongoosejs.com/docs/deprecations.html#findandmodify
mongoose.set("useFindAndModify", false);

// console.log(mongoose)

// ROUTING BEGINS

// Passport middleware and config
app.use(passport.initialize());
require("./config/passport")(passport);

// parse application/json
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));
app.use(express.static('client/build'));

// This will allow the CORS to be allowed over Express for using Axios in React & allows socket.io to work as well 
app.use(cors());
// app.options('*', cors());
// app.options('/api/register', function (req, res) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader('Access-Control-Allow-Methods', '*');
//   res.setHeader("Access-Control-Allow-Headers", "*");
//   res.end();
// });
// app.options('/api/users', function (req, res) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader('Access-Control-Allow-Methods', '*');
//   res.setHeader("Access-Control-Allow-Headers", "*");
//   res.end();
// });

// Defined routes 
app.use("/", defaultRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/board", boardRoutes);


// SOCKET.IO 

const io = require("socket.io")(server);
const botName = "Admin Bot";

let userList = [];
let userMap = new Map();
let lines = new Map();
let Board = require("./models/board");
const { strictEqual } = require("assert");

checkDupeUsers = (users, currUsername) => {
  let check = false; 
  for (let name of users){ 
    if (name == currUsername){
      check = true;
    }
  }
  return check;
}


io.on("connect", socket => {    
  socket.emit("join server", formatMessage(botName, "Connected!"));
  socket.on("chat message", (msg, username, boardId) => {
    if(boardId == ""){
      io.emit("chat message", formatMessage(username, msg));
    }
    else{
      io.to(boardId).emit("chat message", formatMessage(username, msg));
    }
    // if(username == ""){
    //   username = "Anonymous";
    //   // socket.emit("No login", formatMessage("Admin Bot", "Please login"));
    // }

    //if(userOne == socket.id){
      //io.to("game room").emit("chat message", formatMessage("User One", msg, userOne));
    

      //io.emit("chat message", formatMesrsage("User One", msg));
    //}
    //else if(userTwo == socket.id){
      //io.to("game room").emit("chat message", formatMessage("User Two", msg, userTwo));
      //io.emit("chat message", formatMessage("User Two", msg));
    // }
      //console.log("user ID and socket ID did not match... aborting")
      //console.log("User One: " + userOne + " => " + socket.id);
      //console.log("User Two: " + userTwo + " => " + socket.id);

    //io.emit("chat message", msg);
  });

  socket.on("join notification", username =>{
    socket.broadcast.emit("chat message", formatMessage("Admin", `${ username } has arrived!`));
  })

  socket.on("joining", (boardId, username, userListClient) => {
    if(boardId){
      if(userMap.has(boardId) == false){ // board does not exist. add board
        userList.push(username);
        userMap.set(boardId, userList);
      }
      else if(!checkDupeUsers(userMap.get(boardId), username)){ // check for dupes. if there are none, add the name
        userList.push(username);
        userMap.set(boardId, userList);
      }
      else{ // if there are dupes, send error
        console.log("Can't join, user already exists");
      }
      
      for (let [key, value] of userMap) { // logging
        console.log(key + " = " + value);
      }
      
      console.log("the current map: " + JSON.stringify(userMap.get(boardId)));
      console.log("the current map type: " + typeof(userMap.get(boardId)));

      socket.join(boardId);
      socket.emit("joined", (boardId));
      io.to(boardId).emit("userList", userMap.get(boardId));
      return io.emit("chat message", formatMessage(`${username} I am joining a room: ${boardId}`));
    }
    else{
      return io.emit("err", "No boardId given.");
    }
  })

  socket.on("drawing", async (data) => {
    let boardId = data.boardId;
    lines[boardId] = data;
    console.log(JSON.stringify(lines[boardId]));
    // check if the boardId is null
    if(boardId == ""){
      console.log("failed no board Id");
    }
    else{
      console.log(`have id sending to room: ${boardId} with data: ${data}`);
      socket.to(boardId).emit("drawing", data);
    }
  });

  /*
  socket.on("getUsers",  () => {   
    lines[boardId] = data;
    console.log(JSON.stringify(lines[boardId]))
    // check if the boardId is null
    if(boardId == ""){
      console.log("failed no board Id")
    }
    else{
      console.log(`have id sending to room: ${boardId} with data: ${data}`)
      socket.to(boardId).emit("drawing", data)
    }
  });
  */

  socket.on("leaving", (boardId, username) =>{
    console.log(userMap.get(boardId))

    socket.leave(boardId.boardId)
    console.log(boardId.boardId)
    //let currMap = 3 
    //console.log(typeof(userMap.get(boardId)))
    //let currUserList = currMap.filter(name => name != username);
    
    //console.log(currUserList)
    console.log(userMap.get(boardId));

    socket.emit("left room", username.username)
  });

  socket.on("disconnect", () => {
    console.log("destroying");

    userOne = "";
    userTwo = "";
    hasConnected = false;
  });
});

server.listen(PORTNUM, function() {
  console.log(`listening on port: ${PORTNUM}`);
});
