import React from 'react';
import "./styles/styles.css";
import ChatList from "../components/ChatList";
import Title from "./components/Title";
import ChatInput from "../components/ChatInput";

export default class App extends React.Component{
  constructor(props) {
    super(props);
  
    this.state = {
       messages: []
    };
  }

  sendMessage = (data) => {
    this.setState({messages: [...this.state.messages, data]});
  };
  
  render(){
    return (
      <div className="App">
        <Title />
        <ChatList messages={this.state.messages} />
        <ChatInput sendMessage={this.sendMessage} />
      </div>
    );
  }
}
 
