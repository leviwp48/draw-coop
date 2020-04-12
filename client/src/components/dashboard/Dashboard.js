import React, { Component } from "react";
import Modal from "../login/LoginModal.js";
import "./Dashboard.css";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      modalType: false,
      username: "",
      password: ""
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

  submitModal = (type = this.state.modalType) => {};

  handleUsernameChange = e => {
    this.setState({ username: e.target.value });
  };
  handlePasswordChange = e => {
    this.setState({ password: e.target.value });
  };

  handleKeyPress = e => {
    if (e.key === "Enter") {
      alert("here");
    }
  };

  render() {
    return (
      <main>
        <Modal
          show={this.state.show}
          submit={this.submitModal}
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

