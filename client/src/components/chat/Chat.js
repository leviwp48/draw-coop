import React from "react";
import socketIOClient from "socket.io-client";
import {ScrollBox, ScrollAxes, FastTrack} from 'react-scroll-box'; 
import './Chat.css';

var socket = socketIOClient("http://localhost:3000/");
  
class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
        displayData: [],
        message: ""
    };
  }

  // when the chat component mounts it will connect to socket.io, after it will emit a connection message and the message
  // will be sent to the chat list. 
  componentWillMount = () => {
    socket.on("connected", (msg) => {
      console.log(msg);
      this.setState({displayData : [...this.state.displayData, msg.time + " - " + msg.username + " : " + msg.text]})
    })
  }

  componentDidUpdate = () => {
    socket.on("user join", (msg) => {
      console.log(msg);
      this.setState({displayData : [...this.state.displayData, msg.time + " - " + msg.username + " : " + msg.text]})
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
          this.state.displayData.push(<div  id="display-data"><pre>{msg.time + " - " + msg.username + " : " + msg.message}</pre></div>);
        });
        }
  }

  handleClick = e => {
    console.log("here");
    socket.emit("chat message", this.state.message);  
    socket.on("chat message", msg => {    
      this.state.displayData.push(<div  id="display-data"><pre>{msg.time + " - " + msg.username + " : " + msg.message}</pre></div>);    
     });  
  };

render() {
    return (
    <div>  
      <ScrollBox>
          <p>{this.state.displayData}</p>
      </ScrollBox>            
      <div>
      <input
          type="text"
          value={this.state.message}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
      />
      </div>
      <div>
          <button onClick={this.handleClick}>Send</button>
      </div>
    </div>      
    )
}
}
  


export default Chat;