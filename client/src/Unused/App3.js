import React from 'react';
import "./styles/styles.css";
import Chat from "../components/chat/Chat.js";
import Title from "../components/title/Title.js";

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
 