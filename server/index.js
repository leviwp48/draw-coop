const app = require("express")();
const http = require("http")
const server = http.createServer(app);
const io = require("socket.io")(server);
const formatMessage = require("./utils/message");
const mongoose = require('mongoose');
const cors = require('cors');
const PORTNUM = 3001;
const bodyParser = require('body-parser');

// DB Config
const dbkey = require('./config/keys').mongoURI;

let db;
// connecting to mongo with mongoose
mongoose
  .connect(dbkey, {useNewUrlParser: true})
  .then(() => {
    db = mongoose.connection;
    console.log('MDB connected...')
  })
  .catch(err => console.log(err));

  // Projects model from the model folder
let User = require('./models/User');

/*

Routing Begins

*/

// parse application/json
app.use(bodyParser.json());

// This will allow the CORS to be allowed over Express for using Axios in React.
// Allows socket.io to work as well 
app.use(cors());
app.options('*', cors());
app.options('/api/register', function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.end();
});
app.options('/api/login', function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.end();
});

// @route   GET /
// @desc    Dashboard
// @access  Public
// Opens the dashboard
app.get("/", function(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send("connected");
});

// @route   GET api/projects
// @desc    Get All Items
// @access  Public
// Will grab user on login
/*
.then(user => res.json(username))
        .catch(error => {
          console.log(error.response)
          res.json(error.response)
        });
*/
app.get('/api/login', (req, res) =>{
  console.log("Logging in...");

    User.find({username: "tester"}, function(err, user){
      if(err){
        console.log("Couldn't log in.");
        console.log(err);
      }
      else{
        console.log('"Logged in as: ')
        console.log(user)
      }
    })
        
});

// @route   POST /register
// @desc    Create A User
// @access  Public
// Will create new users using the requests body name 
app.post('/api/register', (req, res) =>{
    console.log("Registering...");
    User.create({
      username: req.body.username,
      password: req.body.password
    }, (err, data) => {
      if(err){
        console.log("Couldn't register.");
        console.log(err);
      }
      else{
        console.log("User added: ");
        console.log(data);
      }
    })
    
/*
    user.save()
      .then(user => {
        res.json(user)
      })
      .catch(error => {
        console.log(error.response)
        res.json(error.response)
      });
      */
});

// @route   GET /game-room
// @desc    Get the game room page
// @access  Public
// Get the game room after the user logs in
app.get("/api/game-room", function(req, res) {
  console.log("in the game room");
});

app.get("/api/hi", function(req, res) {
  console.log("HIIII");
  res.json("hi");
});



/*

Routing Ends

=>

Socket.io begins

*/

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

server.listen(PORTNUM, function() {
  console.log(`listening on port: ${PORTNUM}`);
});
