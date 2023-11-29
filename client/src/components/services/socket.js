// socketService.js

import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:3001/";
const socket = socketIOClient(ENDPOINT);

const joinServer = (callback) => {
  socket.on("join server", (msg) => {
    console.log("Connecting...");
    callback(msg);
  });
};

const chatMessage = (callback) => {
  socket.on("chat message", (msg) => {
    console.log("adding message: " + msg);
    callback(msg);
  });
};

const noLogin = (callback) => {
  socket.on("No login", msg => {    
    console.log("adding message: " + msg);
    callback(msg);
  });
};

const userList = (callback) => {
  socket.on("userList", (userList) => {
    console.log("userlist: " )
    callback(userList);
  });
};

const joined = (callback) => {
  socket.on("joined", (boardId, userList) => {
    callback(boardId, userList)
  });
};

const leftRoom = (callback) => {
  socket.on("left room", (boardId, username) => {
    callback(boardId, username)
  });
};

// Add more socket functions as needed

export { socket, joinServer, chatMessage, noLogin, userList, joined, leftRoom};
