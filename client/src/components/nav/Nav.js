import React, { Component } from "react";
import Modal from "../login/LoginModal.js";
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import './Nav.css';
const ENDPOINT = "http://localhost:3001/";

export default class Nav extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
    
    if(this.state.username && this.state.password){

      const user = {
        username: this.state.username,
        password: this.state.password,
      };
      
      axios.post(`${ENDPOINT}api/users/login`, user)
      .then(res => {
        this.props.setUsername(jwt_decode(res.data.token).username);
        this.props.setToken(res.data.token);
        this.setState({show: false});
        sessionStorage.setItem('user', res.data.token)
      })     
      .catch(err => {
        console.log(err.response)
      });
    }
    else{
      if(!this.state.username){
        console.log("no username")
      }
      if(!this.state.password){
        console.log("no password")
      }
    }
  }

  handleSubmitRegister = (e) => {
    e.preventDefault();

    if(this.state.username && this.state.password){

      const user = {
        username: this.state.username,
        password: this.state.password,
      };

      axios.post(`${ENDPOINT}api/users/register`, user)
      .then(res => {
        axios.post(`${ENDPOINT}api/users/login`, user)
        .then(res => {
          this.props.setToken(res.data.token);
          this.props.setUsername(jwt_decode(res.data.token).username);
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
    else{
      if(!this.state.username){
        console.log("no username")
      }
      if(!this.state.password){
        console.log("no password")
      }
    }
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
    sessionStorage.clear();
  }

  showLogin = () => {
    if(this.props.getTokenStatus()){
      return( 
      <div>
        <div className="username">{this.props.getUsername()}</div>
        <div className="logout" onClick={this.logout}>Logout</div>
      </div>
      );
    }
    else{
      return (
      <div>
        <button
          className="button-login"
          id="user"
          type="button"
          onClick={() => this.showModalLogin()}
        >
        Login
        </button>
        
        <button
          className="button-register"
          id="user"
          type="button"
          onClick={() => this.showModalRegister()}
        >
        Register
        </button>
      </div>
      );
    }           
  }

  render() {
    return (
      <div className="nav-container">             
        <Modal 
          ref={node => this.node = node}
          show={this.state.show}
          submitRegister={this.handleSubmitRegister}
          submitLogin={this.handleSubmitLogin}
          onEnter={this.onEnter}
          modalType={this.state.modalType}
          handleClose={this.hideModal}
        >
          <input
            className="input-username"
            id="input"
            type="text"
            placeholder="username"
            value={this.username}
            onChange={this.handleUsernameChange}
            onKeyPress={this.onEnter}
          />
          <input
            className="input-password"
            id="input"
            type="text"
            placeholder="password"
            value={this.state.password}
            onChange={this.handlePasswordChange}
            onKeyPress={this.onEnter}
          />
        </Modal>
        <div className="nav-bar" >
          <h1 className="title">Drawsome</h1>
          {this.showLogin()}  
        </div>          
      </div>
    );
  }
}

