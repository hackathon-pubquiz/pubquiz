import React, { useState } from "react";
import io from "socket.io-client";
import logo from "./logo.svg";
import "./App.css";
import ChatWrapper from "./ChatWrapper";
import Groups from "./Groups";
import Pubs from "./Pubs";
import Persons from "./Persons";
import { login } from "./api";

const socket = io({
  autoConnect: false
});

function LoginStub(props) {
  const [nickname, setNickname] = useState("");

  const handleLogin = () => {
    login(nickname);
  };

  return (
    <div>
      Login:
      <input onChange={e => setNickname(e.target.value)} value={nickname}></input>
      <button onClick={handleLogin}>Go</button>
    </div>
  );
}

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
          <LoginStub></LoginStub>
        </header>
      </div>
    );
  }
}
export default App;
