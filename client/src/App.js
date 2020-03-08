import React from 'react';
import logo from './logo.svg';
import "./styles/styles.css";
import ChatList from "./components/ChatList";
import Title from "./components/Title";
import ChatInput from "./components/ChatInput";
//import './App.css';

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
      <div className="App" id="darkmode">
        <Title />
        <ChatList messages={this.state.messages} />
        <ChatInput sendMessage={this.sendMessage} />
      </div>
    );
  }
}
 

/*
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/