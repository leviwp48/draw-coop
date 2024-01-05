const express = require('express');
const app = require("express")();
const http = require("http")
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require("passport");
const socketModule = require('./socket'); // Import the new socket module

const usersRoutes = require("./routes/api/users");
const boardRoutes = require("./routes/api/board");
const defaultRoutes = require("./routes/index")
const formatMessage = require("./utils/message");

const server = http.createServer(app);
const PORTNUM = process.env.PORT || 3001;

require('dotenv').config();


// TODO: create correct user login by authenticating on the back end then storing a token on the front end

// DB Config
const uri = process.env.MONGO_URI;

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

// Defined routes 
app.use("/", defaultRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/board", boardRoutes);


// SOCKET.IO
const io = socketModule(server); // Use the new socket module


server.listen(PORTNUM, function() {
  console.log(`listening on port: ${PORTNUM}`);
});
