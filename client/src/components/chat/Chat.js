import React, {Component, Context } from "react";
import './Chat.css';
import UserList from './../userlist/UserList';
import { socket, joinServer, chatMessage, noLogin, userList, joined, leftRoom} from "../services/socket";

export const MyContext = React.createContext();

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = { 
        displayData: [],
        message: "",
        id: 0,
        count: 0,
        boardId: "",
        userList: "",
        inBoard: false
    };
    // socket = this.props.socket; will have to see what the repercussions of this are 
    this.chatMessagesRef = React.createRef();

  }

  componentDidMount = () => {
    let messages = localStorage.getItem('messages')
    if (messages){
      for(var i in messages){
        console.log(JSON.stringify(messages))
      }    
    }
    joinServer((msg) => {
      this.addMessageToState(msg)
      localStorage.setItem('messages', this.state.displayData)
      socket.emit("join notification", (this.props.username))
    })
    chatMessage((msg) => {
      console.log("adding message: " + msg);
      this.addMessageToState(msg)
      localStorage.setItem('messages', this.state.displayData)
      this.scrollToBottom();
    }); 
    noLogin((msg) => {    
      this.addMessageToState(msg)
      localStorage.setItem('messages', this.state.displayData)
    });
    userList((userList) => {
      this.setState({userList: userList})
    }); 
    joined((boardId, userList) => {
      this.setState({boardId: boardId, inBoard: true}) // can't have multiple parameters in emit <=====a
    });
    leftRoom((boardId, username) => {
      this.setState({boardId: "", inBoard: false})
    });
  }

  addMessageToState = (msg) => {
    this.setState(prevState => ({
      displayData: [...prevState.displayData, 
        <div className="chat-msg">
          <div className="user-text-box">
            <div className="msg-user">{msg.username}: </div>
            <div className="msg-text">{msg.text}</div>
          </div>
          <div className="msg-time">{msg.time}</div>
        </div>
    ]}));
  }

  scrollToBottom = () => {
    if (this.chatMessagesRef.current) {
      const scrollHeight = this.chatMessagesRef.current.scrollHeight;
      const height = this.chatMessagesRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      this.chatMessagesRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  };

  giveId = (pre) => {
    return `${ pre }_${ new Date().getTime() }`;
  }

  handleChange = e => {
    this.setState({ message: e.target.value });
  }

  handleKeyPress = e => {
    if (e.key === "Enter") {
      if (this.state.message == "") {
        ;
      }
      else{
        socket.emit("chat message", this.state.message, this.props.username, this.state.boardId);
        this.setState({message: ""});
      }
    }
  }

  handleClick = e => {   
    if (this.state.message == "") {
      ;
    }
    else{
      socket.emit("chat message", this.state.message, this.props.username, this.state.boardId);
      this.setState({message: ""});
    }
  }

  listUsers = () => {
    if(this.state.inBoard){ 
      var userList = this.state.userList
      if(userList != ""){
        return(
          <UserList userList={this.state.userList}/>
        )
      }
      else{
        return (
        <p> got nothing </p>
        )
      }
    }
    else{
      return
    }
  }

  render() {
    return (
    <div className="chatBox-container">
      <div className="chatBox">
        <div className="chatMessages" ref={this.chatMessagesRef}>  
          {this.state.displayData}       
        </div>    
        <div className="chatInputBox">
          <input
              className="chatInput"
              type="text"
              placeholder="Start Chatting" 
              value={this.state.message}
              onChange={this.handleChange}
              onKeyPress={this.handleKeyPress}
          />
        </div>  
      </div>
        {this.listUsers()}   
    </div>
    )
  }
}
  
export default Chat;