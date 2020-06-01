import React, { Component } from "react";
import Modal from "../login/LoginModal.js";
import "./Dashboard.css";
import axios from 'axios';
import jwt_decode from 'jwt-decode';

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
        //this.setState({currentUsername: jwt_decode(res.data.token).username})
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
      })
      .catch(err => {
        console.log(err.response)
      });
  }

  /*
  handleKeyPress = e => {
    e.preventDefault();

    const user = {
      username: this.state.name,
      password: this.state.password,
      userId: this.state.userId

    };

    axios.post(`http://localhost:3001/api/register`, { user })
      .then(res => {
        console.log(res);
        console.log(res.data);
      })
  };
*/

  handleUsernameChange = e => {
    this.setState({ username: e.target.value });
  };
  handlePasswordChange = e => {
    this.setState({ password: e.target.value });
  };

  showLoginAndRegister = () => {
    console.log("token: " + this.props.getTokenStatus());
     
    } 
  

  render() {
    return (
      <main>
        <Modal
          show={this.state.show}
          submitRegister={this.handleSubmitRegister}
          submitLogin={this.handleSubmitLogin}
          onEnter={this.handleKeyPress}
          modalType={this.state.modalType}
          handleClose={this.hideModal}
        >
          <input
            className="input-username"
            type="text"
            value={this.username}
            onChange={this.handleUsernameChange}
            onKeyPress={this.handleKeyPress}
          />
          <input
            className="input-password"
            type="text"
            value={this.state.password}
            onChange={this.handlePasswordChange}
            onKeyPress={this.handleKeyPress}
          />
        </Modal>
      
        
          {this.props.getTokenStatus() ?
          
          null
          :
          <div>
          <button
            className="button-login"
            type="button"
            onClick={() => this.showModalLogin()}
          >
          Login
          </button>
          
          <button
            className="button-register"
            type="button"
            onClick={() => this.showModalRegister()}
          >
          Register
          </button>
          </div>
          
          }
      </main>
    );
  }
}

