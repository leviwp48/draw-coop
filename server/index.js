const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const formatMessage = require("./utils/message");
const mongoose = require('mongoose');

// DB Config
const db = require('./config/keys').mongoURI;

// connecting to mongo with mongoose
mongoose
  .connect("mongodb://admin:Ilikepie48@dbh22.mlab.com:27227/socket-io-app", {useNewUrlParser: true})
  .then(() => console.log('MDB connected...'))
  .catch(err => console.log(err));

app.get("/", function(req, res) {
  res.send("connected");
});

app.get("/login", function(req, res) {
  
});

app.get("/game-room", function(req, res) {
  console.log("in the game room");
});

var botName = "Admin";
var userOne = "";
var userTwo = "";

io.on("connection", function(socket) {

  console.log("connected");
  io.emit("connected", formatMessage(botName, "Connection success!"));
  socket.emit("chat message", formatMessage(botName, "Welcome!"));

  // INTERESTING NOTE: using the socket.emit to the "my id" event made it so that the same socket id was used. Not sure why that is yet. 
  // It must have something to do with the a single socket version.

  // Not sure what broadcast does exactly
  socket.broadcast.emit("user join", formatMessage(botName, "A user has joined!"));
  
  // conditional to see which player joins. I should have a sign in page where you can 
  // login as your user
  if(userOne == ""){
    socket.join("game room");
    userOne = socket.id;
    socket.emit("user join", formatMessage(botName, "User One has joined!"));
  }
  else if(userTwo == ""){
    socket.join("game room");
    userTwo = socket.id;
    socket.emit("user join", formatMessage(botName, "User Two has joined!"));
  }


  socket.on("chat message", function(msg) {
    console.log("got the message");
    if(userOne == socket.id){
      io.to("game room").emit("chat message", formatMessage("User One", msg));
    }
    else if(userTwo == socket.id){
      io.to("game room").emit("chat message", formatMessage("User Two", msg));
    }

    //io.emit("chat message", msg);
    socket.on("disconnect", () => {
      console.log("here");

      userOne = "";
      userTwo = "";
    });
  });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
