const app = require("express")();
const http = require("http")
const server = http.createServer(app);
const io = require("socket.io")(server);
const formatMessage = require("./utils/message");
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const PORTNUM = 3005;
const bodyParser = require('body-parser');
const passport = require("passport");
const users = require("./routes/api/users");
const board = require("./routes/api/board");


// TODO: need to migrate to Atlas from MLab
// TODO: create correct user login by authenticating on the back end then storing a token on the front end
// well a makeshift version is probs good enough

// DB Config
const uri = require('./config/keys').mongoURI;

let db;
// connecting to mongo with mongoose
//const MongoClient = require('mongodb').MongoClient;
//const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose
.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    db = mongoose.connection;
    console.log('MDB connected...')
  })
  .catch(err => console.log(err));

  // Projects model from the model folder

/*

Routing Begins

*/

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);

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
app.options('/api/users', function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.end();
});

// Routes
app.use("/api/users", users);
app.use("/api/board", board);

// @route   GET /
// @desc    Dashboard
// @access  Public
// Opens the dashboard
app.get("/", function(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send("connected");
});

// @route   GET /game-room
// @desc    Get the game room page
// @access  Public
// Get the game room after the user logs in
app.get("/api/game-room", function(req, res) {
  console.log("in the game room");
});

app.get("/")
/*

Routing Ends

=>

Socket.io begins

*/

var botName = "Admin Bot";
var userList = [];
var hasConnected = false;
var Board = require("./models/board")

io.on("connect", function(socket) {    

  socket.emit("connected", formatMessage(botName, "Connected!"));

  socket.on("chat message", function(msg, username) {

    if(username == ""){
      username = "Anonymous";
      // socket.emit("No login", formatMessage("Admin Bot", "Please login"));
    }

    console.log("Sending message to client: " + msg + " username: " + username);

    //if(userOne == socket.id){
      //io.to("game room").emit("chat message", formatMessage("User One", msg, userOne));
    io.emit("chat message", formatMessage(username, msg));

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

  socket.on("drawing", (data) => {
    console.log(data);
    // need to check if canvas id exits and need to capture it
    let newBoard = new Board({
      boardData: [data],
      lastModified: Date.now()
  });

   //newCanvas.save()
     // .catch(err => console.log(err));

  io.emit("drawing", data);
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
