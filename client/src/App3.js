import React from 'react';
import logo from './logo.svg';
import "./styles/styles.css";
import Chat from "./components/Chat";
import Title from "./components/Title";

export default class App extends React.Component{
  
  render(){
    return (
      <div className="App" id="darkmode">
        <Title />
        <Chat />>
      </div>
    );
  }
}
 