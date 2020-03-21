import React, { useState, useEffect, Mui } from "react";
import io from 'socket.io-client';
import logo from "./logo.svg";
import "./App.css";
import { darkTheme } from "./Themes";
import { MuiThemeProvider } from "@material-ui/core";
import ChatWrapper from "./ChatWrapper";
import LoginScreen from "./components/LoginScreen";

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
  
  render() {
    return (
      <MuiThemeProvider theme={ darkTheme }>
        <div className="App">
          {/*<header className="App-header">*/}
          {/*  <img src={logo} className="App-logo" alt="logo" />*/}
          {/*  <p>*/}
          {/*    Edit <code>src/App.js</code> and save to reload.*/}
          {/*  </p>*/}
          {/*  <a*/}
          {/*    className="App-link"*/}
          {/*    href="https://reactjs.org"*/}
          {/*    target="_blank"*/}
          {/*    rel="noopener noreferrer"*/}
          {/*    >*/}
          {/*    Learn React*/}
          {/*  </a>*/}
          {/*  <ChatWrapper socket={socket} />*/}
          {/*  <Pubs></Pubs>*/}
          {/*</header>*/}
          <LoginScreen />
        </div>
      </MuiThemeProvider>
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
