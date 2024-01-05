// SOCKET.IO 

const socketIO = require("socket.io");
const formatMessage = require("./utils/message");

module.exports = function (server) {
    const io = socketIO(server);
    const botName = "Admin Bot";
  
    let userList = [];
    let userMap = new Map();
    let lines = new Map();
    let Board = require("./models/board");

    io.on("connect", (socket) => {    

        socket.emit("join server", formatMessage(botName, "Connected!"));

        socket.on("join notification", username =>{
            socket.broadcast.emit("chat message", formatMessage("Admin", `${ username } has arrived!`));
        })

        socket.on("chat message", (msg, username, boardId) => {
          if(boardId == ""){
            io.emit("chat message", formatMessage(username, msg));
          }
          else{
            io.to(boardId).emit("chat message", formatMessage(username, msg));
          }
        });
      
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
            return socket.emit("chat message", formatMessage(`${username} I am joining a room: ${boardId}`));
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
          socket.leave(boardId.boardId)
          socket.emit("left room", username)
        });
      
        socket.on("disconnect", () => {
          console.log("destroying");
          userOne = "";
          userTwo = "";
          hasConnected = false;
        });
      });

    return io;
};

checkDupeUsers = (users, currUsername) => {
    let check = false; 
    for (let name of users){ 
      if (name == currUsername){
        check = true;
      }
    }
    return check;
  }
  

