import React, {Component, Context } from "react";
import socketIOClient from "socket.io-client";
import './Chat.css';

const ENDPOINT = "http://localhost:3001/";
var socket;
export const MyContext = React.createContext();

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = { 
        displayData: [],
        message: "",
        id: 0,
        count: 0,
        boardId: ""
    };
    socket = this.props.socket;
  }
  
  // when the chat component mounts it will connect to socket.io, after it will emit a connection message and the message
  // will be sent to the chat list. 

  componentWillMount = () => {

    let messages = localStorage.getItem('messages')
    if (messages){
      let test = []
      for(var i in messages){
        console.log(JSON.stringify(messages))
      }
      //this.setState({displayData: messages})
    }
    socket.on("join server", (msg) => {
      console.log("Connecting...");
      this.setState({displayData : [...this.state.displayData, <div>{msg.time + " - " + msg.username + ": " + msg.text + " "}</div>]})
      localStorage.setItem('messages', this.state.displayData)
      console.log(this.props.username)
      socket.emit("join notification", (this.props.username))
    })
    socket.on("chat message", msg => {    
      console.log("adding message: " + msg);
      this.setState({displayData : [...this.state.displayData, <div>{msg.time + " - " + msg.username + ": " + msg.text + " "}</div>]})
      localStorage.setItem('messages', this.state.displayData)
      console.log(...this.state.displayData);
    }); 
    socket.on("No login", msg => {    
      console.log("adding message: " + msg);
      this.setState({displayData : [...this.state.displayData, msg.time + " - " + msg.username + ": " + msg.text + " "]})     
      localStorage.setItem('messages', this.state.displayData)
      console.log(...this.state.displayData);
    }); 
    socket.on("joined", boardId => {
      this.setState({boardId: boardId})
    });
    socket.on("left room", res => {
      this.setState({boardId: ""})
    });
  }
 
  giveId = (pre) => {
    return `${ pre }_${ new Date().getTime() }`;
  }

  handleChange = e => {
    this.setState({ message: e.target.value });
  }

  handleKeyPress = e => {
    if (e.key === "Enter") {
      // if(this.props.username == ""){
      //   socket.emit("chat message", this.state.message, "");
      //   this.setState({message: ""});
      // }
      socket.emit("chat message", this.state.message, this.props.username, this.state.boardId);
      this.setState({message: ""});
    }
  }

  handleClick = e => {   
    // if(this.props.username == ""){
    //   socket.emit("chat message", this.state.message, "");
    //   this.setState({message: ""});
    // }
    socket.emit("chat message", this.state.message, this.props.username, this.state.boardId);
    this.setState({message: ""});
  }

  render() {
    return (
    <div className="chatBox-container">
      <div className="chatBox">  
        {this.state.displayData}        
      </div>    
      <div className="chatInputBox">
        <input
            className="chatInput"
            type="text"
            placeholder="Type here" 
            value={this.state.message}
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
        />
      </div>  
    </div>
    
    )
  }
}
  
export default Chat;