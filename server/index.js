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

var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

var userOne = "";
var userTwo = "";
console.log("just starting");
console.log("userONe: " + userOne);

io.on("connection", function(socket) {
  io.emit("connected", "Connection success!");

  // INTERESTING NOTE: using the socket.emit to the "my id" event made it so that the same socket id was used. Not sure why that is yet. 
  // It must have something to do with the a single socket version.

  // saving the socket.id in a variable
  
 // socket.on("my id", () => {
    if(userOne == ""){
      socket.join("game room");
      userOne = socket.id;
      console.log("User one: " + userOne);
    }
    else if(userTwo == ""){
      socket.join("game room");
      userTwo = socket.id;
      console.log("User two: " + userTwo);
    }
 // });


  socket.on("chat message", function(msg) {

    if(userOne == socket.id){
      io.to("game room").emit("chat message", "user-1", msg);
    }
    else if(userTwo == socket.id){
      io.to("game room").emit("chat message", "user-2", msg);
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
