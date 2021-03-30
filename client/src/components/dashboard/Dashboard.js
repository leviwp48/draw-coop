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
      currentUsername: "",
      currentUserId: "",
      show: false,
      modalType: true,
      username: "",
      password: "",
    };
  }
 
  showModalLogin = () => {
    this.setState({
      show: true,
      modalType: true
    });
  };

  showModalRegister = () => {
    this.setState({
      show: true,
      modalType: false
    });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  handleSubmitLogin = (e) => {
    e.preventDefault();

    const user = {
      username: this.state.username,
      password: this.state.password,
    };
    
    axios.post(`http://localhost:3001/api/users/login`, user)
      .then(res => {
        console.log("login response: ");
        console.log(res.data.token);
        console.log(jwt_decode(res.data.token).username);
        this.props.setToken(res.data.token);
        this.props.setUsername(jwt_decode(res.data.token).username);
        console.log("almost connected");    
        this.setState({show: false});
      })
      .catch(err => {
        console.log(err.response)
      });
  }

  handleSubmitRegister = (e) => {
    e.preventDefault();

    const user = {
      username: this.state.username,
      password: this.state.password,
    };
    console.log(user.username);
    console.log(user.password);

    axios.post(`http://localhost:3001/api/users/register`, user)
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.setState({show: false});
        axios.post(`http://localhost:3001/api/users/login`, user)
        .then(res => {
          console.log("login response: ");
          console.log(res.data.token);
          console.log(jwt_decode(res.data.token).username);
          this.props.setToken(res.data.token);
          this.props.setUsername(jwt_decode(res.data.token).username);
          console.log("almost connected");    
          this.setState({show: false});
        })
        .catch(err => {
          console.log(err.response)
        });
      })
      .catch(err => {
        console.log(err.response)
      });
  }

  onEnter = (e) => {
    if (e.key === "Enter"){
      if(this.state.modalType === true){
        this.handleSubmitLogin(e)
      }
      else{
        this.handleSubmitRegister(e)
      }
    } 
  }

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
             deleteToken={this.props.deleteToken}/>
        <BoardList/>
      </div>
    );
  }
}

//         <Chat getUsername={this.props.getUsername} />

