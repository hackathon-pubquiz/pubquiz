import React from "react";
import io from "socket.io-client";
import logo from "./logo.svg";
import "./App.css";
import ChatWrapper from "./ChatWrapper";
import Groups from "./Groups";
import Pubs from "./Pubs";
import Persons from "./Persons";
import WebRTC from "./WebRTC";

const socket = io({
  autoConnect: false
});

class App extends React.Component {
  componentDidMount() {
    socket.open();
  }

  render() {
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
          <ChatWrapper socket={socket} />
          <Pubs></Pubs>
          <Groups></Groups>
          <Persons></Persons>
          <WebRTC></WebRTC>
        </header>
      </div>
    );
  }
}
export default App;
