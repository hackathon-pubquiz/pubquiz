import React, { useState, useEffect } from "react";
import io from 'socket.io-client';
import logo from "./logo.svg";
import "./App.css";

const useFetch = url => {
  const [data, updateData] = useState(undefined);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(url);
      const json = await response.json();
      updateData(json);
    }
    fetchData();
  }, [url]);

  return data;
};

const socket = io({
  autoConnect: false
});

class App extends React.Component {
  componentDidMount() {
    socket.open();
  }
  
  onClickHandler = () => {
    socket.emit('chat_message');
  };
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code onClick={this.onClickHandler}>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
            >
            Learn React
          </a>
          <Pubs></Pubs>
        </header>
      </div>
    );
  }
}

function Pubs(props) {
  const pubs = useFetch("/api/pubs");

  return (
    <div>
      Pubs:
      {JSON.stringify(pubs)}
    </div>
  );
}

export default App;
