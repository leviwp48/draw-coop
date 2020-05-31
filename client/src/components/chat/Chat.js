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
        id: 0
    };
  }
  
  // when the chat component mounts it will connect to socket.io, after it will emit a connection message and the message
  // will be sent to the chat list. 
  componentWillMount = () => {
    socket = socketIOClient("http://localhost:3001/");
    socket.on("connected", (msg) => {
      this.setState({displayData : [...this.state.displayData, <div>{msg.time + " - " + msg.username + ": " + msg.text + " "}</div>]})
      
      console.log(this.state.displayData);
    })
    
    socket.on("user connected", (msg) => {
      console.log(msg);
      //this.setState({displayData : [...this.state.displayData, <p>{msg.time + " - " + msg.username + ": " + msg.text + " "}</p>]})
    })
    socket.on("user ready", (msg) => {
      console.log(msg.id);
      this.setState({displayData : [...this.state.displayData, <p>{msg.time + " - " + msg.username + ": " + msg.text + " "}</p>]})
      this.setState({id: msg.id})
    })
    
  }

  giveId = (pre) => {
    return `${ pre }_${ new Date().getTime() }`;
  }

  newUserJoins = () => {

  }

  

  componentDidUpdate = () => {
    socket.on("user ready", (msg) => {
      console.log(msg.id);
      //this.setState({displayData : [...this.state.displayData, <p>{msg.time + " - " + msg.username + ": " + msg.text + " "}</p>]})
      this.setState({id: msg.id})
    })
  }

  componentWillUnmount = () => {
    this.setState({displayData: []});
    this.setState({message: ""});
    this.setState({id: 0});
  }

  handleChange = e => {
    this.setState({ message: e.target.value });
    console.log(this.state.displayData);

  }

  handleKeyPress = e => {
    if (e.key === "Enter") {
      console.log("here");
        //socket.emit("chat message", this.state.message);
        //socket.on("chat message", msg => {    
          //this.state.displayData.push(<div id="display-data"><div>{msg.time + " - " + msg.username + " : " + msg.text}</div></div>);
          //this.state.displayData.push(<div>{msg.time + " - " + msg.username + " : " + msg.message}</div>);

        //});
        }
  }

  handleClick = e => {
    console.log(this.state.displayData);
    console.log("here " + this.state.message);
    socket.once("chat message", msg => {    
      console.log("adding message");
      this.setState({displayData : [...this.state.displayData, <div>{msg.time + " - " + msg.username + ": " + msg.text + " "}</div>]})
  
      //this.state.displayData.push(<div>{msg.time + " - " + msg.username + " : " + msg.text}</div>);
      //this.state.displayData.push(msg.time + " - " + msg.username + " : " + msg.text);     
      //this.setState({displayData : [...this.state.displayData, <p>{msg.time + " - " + msg.username + ": " + msg.text + " "}</p>]});
    }); 
    /*
    // would be using a callback function on the server side, so it won't have access to the state.. so we can't use that. 
    socket.emit("chat message", this.state.message, function(msg){
      console.log("adding message");
      this.state.displayData.push(<div>{msg.time + " - " + msg.username + " : " + msg.text}</div>);
    });
  }*/ 
  socket.emit("chat message", this.state.message);
  }

render() {
  //let list = this.state.displayData.map (data =>
    //<span key={this.giveId("lool")}>{data}</span> )


    return (
    <div className="chatBox">  
      <div className="scrollBox">
        {this.state.displayData}
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