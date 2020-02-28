import React from 'react';
import logo from './logo.svg';
import "./styles/styles.css";
import ChatBox from "./ChatBox";
//import './App.css';

export default function App() {
  return (
    <div className="App" id="darkmode">
      <h1>Coop Text Adventure</h1>
      <h2>Play with yourself or with Friends!... Enemies too.</h2>
      <ChatBox />
    </div>
  );
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