import React, { Component } from 'react';
import "./App.css";
import Chat from "../chat/Chat.js";
import Title from "../title/Title.js";
import Dashboard from "../dashboard/Dashboard";

export default class App extends Component{
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      redirectTo: "/Dashboard",
      token: "",
      tokenStatus: false
    };
  }

  setUsername = (name) => {
    this.setState({username: name});
  }

  getUsername = () => {
    return this.state.username
  }
  setToken = (jwt) => {
    this.setState({token: jwt, tokenStatus: true});
    console.log("jwt: " + this.state.token);
  }

  getToken = () => {
    return this.state.token;
  }
  getTokenStatus = () => {
    return this.state.tokenStatus;
  }

    //TODO implement React Router or pass down components to children to swtich pages
  render(){
    return (
      <div className="App" id="darkmode">
        <h1 className="Title">Zawardo!!!</h1>

        <Dashboard setUsername={this.setUsername} getUsername={this.getUsername} 
                   setToken={this.setToken} getToken={this.getToken} getTokenStatus={this.getTokenStatus}/>
        
      </div>
    );
  }
}
 