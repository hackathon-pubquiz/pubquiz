import React, { useState } from "react";
import { BrowserRouter as Router, Link as RouterLink, Route, Switch } from "react-router-dom";
import io from "socket.io-client";
import ChatWrapper from "./ChatWrapper";
import Groups from "./Groups";
import Persons from "./Persons";

import { login } from "./api";
import Pubs from "./Pubs";
import { Tabs, Tab, Grid, AppBar } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";

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
      <Router>
        <CssBaseline />
        <AppBar position="static">
          <Tabs component="nav">
            <Tab component={RouterLink} to="/login" label="Login"></Tab>
            <Tab component={RouterLink} to="/pubs" label="Pubs"></Tab>
            <Tab component={RouterLink} to="/groups" label="Gruppen"></Tab>
            <Tab component={RouterLink} to="/people" label="Personen"></Tab>
          </Tabs>
        </AppBar>
        <Grid container justify="space-evenly">
          <Grid item>
            <ChatWrapper socket={socket} />
          </Grid>
          <Grid item>
            <Switch>
              <Route path="/login">
                <LoginStub></LoginStub>
              </Route>
              <Route path="/pubs">
                <Pubs></Pubs>
              </Route>
              <Route path="/groups">
                <Groups></Groups>
              </Route>
              <Route path="/people">
                <Persons></Persons>
              </Route>
            </Switch>
          </Grid>
        </Grid>
      </Router>
    );
  }
}
export default App;
