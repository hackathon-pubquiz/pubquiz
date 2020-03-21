import React from "react";
import io from "socket.io-client";
import logo from "./logo.svg";
import "./App.css";
import ChatWrapper from "./ChatWrapper";
import Groups from "./Groups";
import Pubs from "./Pubs";
import Persons from "./Persons";
import Player from "./Player";

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
          <Player></Player>
          <ChatWrapper socket={socket} />
          <Pubs></Pubs>
          <Groups></Groups>
          <Persons></Persons>
        </header>
      </div>
    );
  }
}
export default App;
