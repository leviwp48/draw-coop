const app = require("express")();
const http = require("http")
const server = http.createServer(app);
const io = require("socket.io")(server);
const formatMessage = require("./utils/message");
const mongoose = require('mongoose');
const cors = require('cors');
const PORTNUM = 3001;
const bodyParser = require('body-parser');



// TODO: create correct user login by authenticating on the back end then storing a token on the front end
// well a makeshift version is probs good enough

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
app.post('/api/login', (req, res) =>{
  console.log("Logging in...");

    User.findOne({username: req.body.username, password: req.body.password}, function(err, user){
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

var botName = "Admin Bot";
var userOne = "";
var userTwo = "";
var hasConnected = false;

io.on("connect", function(socket) {
  console.log("connecting...");

  if(!hasConnected){
    console.log("first time connecting!")
    io.emit("connected", formatMessage(botName, "Connection success!"));
    hasConnected = true;
  }
  else{
    console.log('second time connecting!');
    socket.broadcast.emit("user connected", formatMessage(botName, "A user has joined!"));
  }
  
  // socket.emit("chat message", formatMessage(botName, "Welcome!"));

  // INTERESTING NOTE: using the socket.emit to the "my id" event made it so that the same socket id was used. Not sure why that is yet. 
  // It must have something to do with the a single socket version.

  // Not sure what broadcast does exactly
  
  // conditional to see which player joins. I should have a sign in page where you can 
  // login as your user


  if(userOne == ""){
    userOne = socket.id;
    //socket.join("game room");
    //socket.broadcast.emit("user ready", formatMessage(botName, "User One has joined!", userOne));
  }
  else if(userTwo == ""){
    //socket.join("game room");
    userTwo = socket.id;
    //socket.broadcast.emit("user ready", formatMessage(botName, "User Two has joined!", userTwo));
  }

  console.log("current users, UserOne: " + userOne + " & " + "UserTwo: " + userTwo);

  socket.on("chat message", function(msg) {

    console.log(io.engine.clientsCount);

    console.log("Sending message to client: " + msg);
   // if(userOne == socket.id){
      //io.to("game room").emit("chat message", formatMessage("User One", msg, userOne));

      io.emit("chat message", formatMessage("User One", msg));
   // }
    //else if(userTwo == socket.id){
      //io.to("game room").emit("chat message", formatMessage("User Two", msg, userTwo));
      //io.emit("chat message", formatMessage("User Two", msg));
    //}
      //console.log("user ID and socket ID did not match... aborting")
      console.log("User One: " + userOne + " => " + socket.id);
      console.log("User Two: " + userTwo + " => " + socket.id);
  
    //io.emit("chat message", msg);
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
