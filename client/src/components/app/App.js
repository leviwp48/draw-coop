import React, { Component } from 'react';
import "./App.css";
import Dashboard from "../dashboard/Dashboard";

export default class App extends Component{
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      token: "",
      tokenStatus: false
    };
  }

  // Below functions store the username, login token, and token status in the main app 
  setUsername = (name) => {
    this.setState({username: name});
  }
  getUsername = () => {
    return this.state.username
  }
  setToken = (jwt) => {
    this.setState({token: jwt, tokenStatus: true});
  }
  getToken = () => {
    return this.state.token;
  }
  getTokenStatus = () => {
    return this.state.tokenStatus;
  }
  deleteToken = () => {
    this.setState({token: "", tokenStatus: false, username: ""});
    console.log("loggin out");
  }

  render(){
    return (
      <div className="App" id="darkmode">
        <Dashboard setUsername={this.setUsername} getUsername={this.getUsername} 
                   setToken={this.setToken} getToken={this.getToken} getTokenStatus={this.getTokenStatus}
                   deleteToken={this.deleteToken}/>
      </div>
    );
  }
}
 