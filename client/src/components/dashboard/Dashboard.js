import React, { Component } from "react";
import Modal from "../login/LoginModal.js";
import "./Dashboard.css";
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import Chat from "../chat/Chat.js";
import Board from "../board/Board";
import Nav from "../nav/Nav";
import BoardList from "../boardlist/BoardList";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: "",
    }
  }
  
  setUserId = (id) =>{
    this.setState({userId: id})
  }

  createBoard = () => {
    const userId = {
      id:this.state.userId
    }

    console.log(userId);
    axios.post(`http://localhost:3001/api/board/createBoard`, userId)
      .then(res => {
        console.log("creating a new board for user: " + userId)
        })
        .catch(err => {
          console.log(err.response)
        });
    }
  

  getImage = () => {
  
    axios.get(`http://localhost:3001/api/board/image`)
      .then(res => {
        console.log("Grabbing board image for: ");
      })
      .catch(err => {
        console.log(err.response)
      });
  };

  handleUsernameChange = e => {
    this.setState({ username: e.target.value });
  };

  handlePasswordChange = e => {
    this.setState({ password: e.target.value });
  };

  showLoginAndRegister = () => {
    console.log("token: " + this.props.getTokenStatus());    
  } 

  logout = () => {
    this.props.deleteToken();
  }

  render() {
    return (
      <div>        
        <Nav setUsername={this.props.setUsername} getUsername={this.props.getUsername} 
             setToken={this.props.setToken} getToken={this.props.getToken} getTokenStatus={this.props.getTokenStatus}
             deleteToken={this.props.deleteToken} setUserId={this.setUserId}/>
        <BoardList getImage={this.getImage} getAuthor={this.getAuthor} getLastModified={this.getModified} />
          <button
            className="createBoard"
            type="button"
            onClick={() => this.createBoard()}
          >
          create board
          </button>
      </div>
    );
  }
}

//         <Chat getUsername={this.props.getUsername} />

