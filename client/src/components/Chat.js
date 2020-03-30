import React from "react";
import Input from "@material-ui/core/Input";
import "./../styles/styles.css";
import socketIOClient from "socket.io-client";
import { styled } from "@material-ui/core/styles";


var socket = socketIOClient("http://localhost:3000/");

const MyInput = styled(Input)({
    height: "100%",
    paddingLeft: "5px",
    paddingRight: "5px",
    backgroundColor: "#000000",
    color: "#FFFFFF"
  });
  
class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
        displayData: [],
        message: "",
        username: "",
        time: ""
    };
  }

  
  // when the chat component mounts it will connect to socket.io, after it will emit a connection message and the message
  // will be sent to the chat list. 
  componentDidMount = () => {
    socket.on("connected", (msg) => {
        console.log('here');
        this.setState({message : msg});
    })
  }

  handleChange = e => {
    this.setState({ message: e.target.value });
  }
  handleKeyPress = e => {
    if (e.key === "Enter") {
        socket.emit("chat message", this.state.message);
        socket.on("chat message", msg => {    
            this.state.displayData.push(<div  id="display-data"><pre>{this.state.time + " - " + this.state.username + " : " + this.state.message}</pre></div>);
            this.setState({message : ""});
            this.setState({time: ""});
            this.setState({username: ""});

        });
        }
  }
  handleClick = e => {
    socket.emit("chat message", this.state.message);  
    socket.on("chat message", msg => {    
        this.state.displayData.push(<div  id="display-data"><pre>{this.state.time + " - " + this.state.username + " : " + this.state.message}</pre></div>);
        this.setState({message : ""});
        this.setState({time: ""});
        this.setState({username: ""});   
     });  
  };

render() {
    return (
    <div>  
        <body>
            <div> 
                <p>{this.state.displayData}</p>
            </div>
            <div>
            <MyInput
                type="text"
                fullWidth={true}
                value={this.state.message}
                onChange={this.handleChange}
                onKeyPress={this.handleKeyPress}
            />
            </div>
            <div>
                <button onClick={this.handleKeyPress}>Send</button>
            </div>
        </body>   
    </div>      
    )
}
}
  


export default Chat;