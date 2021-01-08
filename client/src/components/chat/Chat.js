import React, {Component, Context } from "react";
import socketIOClient from "socket.io-client";
import {ScrollBox, FastTrack} from 'react-scroll-box'; 
import './Chat.css';

const ENDPOINT = "http://127.0.0.1:3001";
var socket;
export const MyContext = React.createContext();

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = { 
        displayData: [],
        message: "",
        id: 0,
        count: 0
    };
  }
  
  // when the chat component mounts it will connect to socket.io, after it will emit a connection message and the message
  // will be sent to the chat list. 

  componentWillMount = () => {

    socket = socketIOClient(ENDPOINT);

    socket.on("connected", (msg) => {
      console.log("Connecting...");
      this.setState({displayData : [...this.state.displayData, <div>{msg.time + " - " + msg.username + ": " + msg.text + " "}</div>]})
    })
    socket.on("chat message", msg => {    
      console.log("adding message: " + msg);
      this.setState({displayData : [...this.state.displayData, <div>{msg.time + " - " + msg.username + ": " + msg.text + " "}</div>]})
      console.log(...this.state.displayData);
    }); 
    socket.on("No login", msg => {    
      console.log("adding message: " + msg);
      this.setState({displayData : [...this.state.displayData, <div>{msg.time + " - " + msg.username + ": " + msg.text + " "}</div>]})     
      console.log(...this.state.displayData);
    }); 
  }

  giveId = (pre) => {
    return `${ pre }_${ new Date().getTime() }`;
  }

  componentWillUnmount = () => {
    this.setState({displayData: []});
    this.setState({message: ""});
    this.setState({id: 0});
  }

  handleChange = e => {
    this.setState({ message: e.target.value });
  }

  handleKeyPress = e => {
    if (e.key === "Enter") {
      if(this.props.getUsername == ""){
        socket.emit("chat message", this.state.message, "");
        this.setState({message: ""});
      }
      else{
        socket.emit("chat message", this.state.message, this.props.getUsername);
        this.setState({message: ""});
      }
    }
  }

  handleClick = e => {   
    if(this.props.getUsername == ""){
      socket.emit("chat message", this.state.message, "");
      this.setState({message: ""});
    }
    else{
      socket.emit("chat message", this.state.message, this.props.getUsername);
      this.setState({message: ""});
    }
  }

  render() {
    return (
    <div className="chatBoxContainer">
      <div className="chatBoxWrapper">
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
    </div>
    
    )
  }
}
  
export default Chat;