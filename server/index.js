/*
const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);
*/

const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const formatMessage = require("./utils/message");

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

var botName = "Admin";
var userOne = "";
var userTwo = "";
console.log("just starting");
console.log("userONe: " + userOne);

io.on("connection", function(socket) {

  io.emit("connected", "Connection success!");
  socket.emit("chat message", formatMessage(botName, "Welcome!"));

  // INTERESTING NOTE: using the socket.emit to the "my id" event made it so that the same socket id was used. Not sure why that is yet. 
  // It must have something to do with the a single socket version.

  // Not sure what broadcast does exactly
  socket.broadcast.emit("chat message", formatMessage(botName, "A user has joined!"));
  
  // conditional to see which player joins. I should have a sign in page where you can 
  // login as your user
  if(userOne == ""){
    socket.join("game room");
    userOne = socket.id;
    socket.emit("chat message", formatMessage(botName, "User One has joined!"));
  }
  else if(userTwo == ""){
    socket.join("game room");
    userTwo = socket.id;
    socket.emit("chat message", formatMessage(botName, "User Two has joined!"));
  }


  socket.on("chat message", function(msg) {

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
