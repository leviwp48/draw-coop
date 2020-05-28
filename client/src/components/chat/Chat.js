import React, {Component, Context } from "react";
import socketIOClient from "socket.io-client";
import {ScrollBox, FastTrack} from 'react-scroll-box'; 
import './Chat.css';

var socket;
export const MyContext = React.createContext();

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = { 
        displayData: [],
        message: "",
        id: ""
    };
  }
  // when the chat component mounts it will connect to socket.io, after it will emit a connection message and the message
  // will be sent to the chat list. 
  componentWillMount = () => {
    socket = socketIOClient("http://localhost:3001/");
    socket.on("connected", (msg) => {
      this.setState({displayData : [...this.state.displayData, <p>{msg.time + " - " + msg.username + ": " + msg.text + " "}</p>]})
      console.log(this.state.displayData);
    })
    socket.on("user connected", (msg) => {
      console.log(msg);
      this.setState({displayData : [...this.state.displayData, <p>{msg.time + " - " + msg.username + ": " + msg.text + " "}</p>]})
    })
    socket.on("user ready", (msg) => {
      console.log(msg.id);
      this.setState({displayData : [...this.state.displayData, <p>{msg.time + " - " + msg.username + ": " + msg.text + " "}</p>]})
      this.setState({id: msg.id})
      console.log(this.state.displayData);

    })
  }

  newUserJoins = () => {

  }

  
  componentDidUpdate = () => {
    socket.on("user ready", (msg) => {
      console.log(msg.id);
      this.setState({displayData : [...this.state.displayData, <p>{msg.time + " - " + msg.username + ": " + msg.text + " "}</p>]})
      this.setState({id: msg.id})
    })
  }

  componentWillUnmount = () => {
    this.setState({displayData: []});
    this.setState({message: ""});
  }

  handleChange = e => {
    this.setState({ message: e.target.value });
  }

  handleKeyPress = e => {
    if (e.key === "Enter") {
      console.log("here");
        socket.emit("chat message", this.state.message);
        socket.on("chat message", msg => {    
          this.state.displayData.push(<div  id="display-data"><span>{msg.time + " - " + msg.username + " : " + msg.message}</span></div>);
        });
        }
  }

  handleClick = e => {
    console.log("here " + this.state.message);
    socket.emit("chat message", this.state.message);  
    socket.on("chat message", msg => {    
      this.state.displayData.push(<div  id="display-data"><span>{msg.time + " - " + msg.username + " : " + msg.message}</span></div>);    
     });  
  };

render() {
    return (
    <div className="chatBox">  
      <div className="scrollBox">
      <p> ID: {this.state.id} </p>

          <span>{this.state.displayData}</span>
      </div>            
      <div className="chatInputBox">
        <input
            className="chatInput"
            type="text"
            value={this.state.message}
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
        />
        <button 
        className="chatButton"
        type="button"
        onClick={this.handleClick}>
            Send
        </button>
      </div>
    </div>      
    )
}
}
  


export default Chat;