import React, { Component } from "react";
import Modal from "../login/LoginModal.js";
import "./Dashboard.css";
import axios from 'axios';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      modalType: false,
      username: "",
      password: "",
      userId: "testdummy1"
    };
  }

  showModal = type => {
    console.log(type);
    this.setState({
      modalType: type,
      show: true
    });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      username: this.state.name,
      password: this.state.password,
      userId: this.state.userId

    };

    axios.post(`http://localhost:3000/register`, { user })
      .then(res => {
        console.log(res);
        console.log(res.data);
      })
  }

  handleKeyPress = e => {
    e.preventDefault();

    const user = {
      username: this.state.name,
      password: this.state.password,
      userId: this.state.userId

    };

    axios.post(`localhost:3000/register`, { user })
      .then(res => {
        console.log(res);
        console.log(res.data);
      })
  };

  handleUsernameChange = e => {
    this.setState({ username: e.target.value });
  };
  handlePasswordChange = e => {
    this.setState({ password: e.target.value });
  };

  

  render() {
    return (
      <main>
        <Modal
          show={this.state.show}
          submit={this.handleSubmit}
          onEnter={this.handleKeyPress}
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
        <button
          className="button-login"
          type="button"
          onClick={() => this.showModal(false)}
        >
          Login
        </button>
        <button
          className="button-register"
          type="button"
          onClick={() => this.showModal(true)}
        >
          Register
        </button>
      </main>
    );
  }
}

