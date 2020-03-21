import React, { useState } from "react";
import { BrowserRouter as Router, Link as RouterLink, Route, Switch } from "react-router-dom";
import io from "socket.io-client";
import clsx from "clsx";

import ChatWrapper from "./TextChat/ChatWrapper";
import Groups from "./Groups";
import Persons from "./Persons";
import QuizMaster from "./pages/QuizMaster";
import Player from "./Player";
import { darkTheme } from "./Themes";
import { withStyles, MuiThemeProvider } from "@material-ui/core";
import LoginScreen from "./components/RegisterTeamScreen";
import Quiz from "./Quiz/quiz";

import { useDispatch } from "react-redux";
import { requestLoginUser, requestLogoutUser } from "./redux/sessions";
import Pubs from "./Pubs";
import { Tabs, Tab, Grid, AppBar, Typography } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { connect } from "react-redux";
import Drawer from "@material-ui/core/Drawer";
import ChatIcon from "@material-ui/icons/Chat";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

const socket = io({
  autoConnect: false
});

const drawerClosedWidth = theme => {
  return theme.spacing(10);
};
const drawerOpenWidth = 240;

function LoginStub(props) {
  const [nickname, setNickname] = useState("");
  const dispatch = useDispatch();

  const handleLogin = () => {
    dispatch(requestLoginUser(nickname));
  };

  return (
    <div>
      Login [Im Moment: Einloggen mit Benutername. Gibt es den Benutzer noch nicht, wird ein neuer angelegt.]
      <br />
      <input onChange={e => setNickname(e.target.value)} value={nickname}></input>
      <button onClick={handleLogin}>Go</button>
    </div>
  );
}

function drawerTransition(theme, attributes, leaving) {
  return theme.transitions.create(attributes, {
    easing: theme.transitions.easing.sharp,
    duration: leaving ? theme.transitions.duration.leavingScreen : theme.transitions.duration.enteringScreen
  });
}

const styles = theme => ({
  main: {
    background: theme.palette.background.default,
    height: "100vh",
    "& > :last-child": {
      flexGrow: 1
    }
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: drawerTransition(theme, ["width", "margin"], true)
  },
  appBarShift: {
    marginLeft: drawerOpenWidth,
    width: `calc(100% - ${drawerOpenWidth}px)`,
    transition: drawerTransition(theme, ["width", "margin"], false)
  },
  drawer: {
    width: drawerOpenWidth,
    flexShrink: 0,
    whiteSpace: "nowrap"
  },
  drawerOpen: {
    width: drawerOpenWidth,
    transition: drawerTransition(theme, "width", false)
  },
  drawerClose: {
    transition: drawerTransition(theme, "width", true),
    overflowX: "hidden",
    width: drawerClosedWidth(theme)
  },
  content: {
    paddingTop: theme.spacing(9)
  },
  contentDrawerClosed: {
    paddingLeft: drawerClosedWidth(theme) + theme.spacing(2),
    transition: drawerTransition(theme, "padding-left", false)
  },
  contentDrawerOpen: {
    paddingLeft: drawerOpenWidth + theme.spacing(2),
    transition: drawerTransition(theme, "padding-left", true)
  }
});

class App extends React.Component {
  componentDidMount() {
    socket.open();
  }

  constructor(props) {
    super(props);

    this.state = { open: false };
  }

  render() {
    const handleDrawerOpen = () => {
      console.log("Opening drawer");
      this.setState({ open: true });
    };

    const handleDrawerClose = () => {
      console.log("Closing drawer");
      this.setState({ open: false });
    };

    const profileElement = nickname => (
      <div>
        <Button
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          color="inherit"
          onClick={this.handleMenu}
          startIcon={<AccountCircle />}
        >
          {nickname}
        </Button>
        <Button onClick={() => this.props.requestLogoutUser()}>Logout</Button>
      </div>
    );

    const { classes } = this.props;

    const open = this.state.open;
    return (
      <Router>
        <CssBaseline />

        <AppBar
          position="static"
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open
          })}
        >
          <Tabs component="nav" value={false}>
            <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} edge="start">
              <ChatIcon />
            </IconButton>
            <Tab component={RouterLink} to="/pubs" label="Pubs"></Tab>
            <Tab component={RouterLink} to="/groups" label="Gruppen"></Tab>
            <Tab component={RouterLink} to="/people" label="Personen"></Tab>
            <Tab component={RouterLink} to="/player" label="Player"></Tab>
            <Tab component={RouterLink} to="/quizmaster" label="Quizmaster"></Tab>
            {this.props.authenticated ? (
              profileElement(this.props.loggedInUser.nickname)
            ) : (
              <Tab component={RouterLink} to="/login" label="Login"></Tab>
            )}
            <Tab component={RouterLink} to="/login2" label="Login"></Tab>
            <Tab component={RouterLink} to="/quiz" label="Quiz"></Tab>
          </Tabs>
        </AppBar>
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open
            })
          }}
        >
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>

          <ChatWrapper socket={socket} open={open} />
        </Drawer>
        <main
          className={clsx(classes.content, { [classes.contentDrawerOpen]: open, [classes.contentDrawerClosed]: !open })}
        >
          <Switch>
            <Route path="/login">
              <LoginStub></LoginStub>
            </Route>
            <Route path="/login2">
              <LoginScreen></LoginScreen>
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
            <Route path="/player">
              <Player></Player>
            </Route>
            <Route path="/quizmaster/:pubId/:quizId">
              <QuizMaster />
            </Route>
            <Route path="/quiz">
              <Quiz></Quiz>
            </Route>
          </Switch>
        </main>
      </Router>
    );
  }
}

const mapStateToProps = ({ session }) => {
  return {
    checked: session.checked,
    authenticated: session.authenticated,
    loggedInUser: session.user
  };
};

const mapDispatchToProps = { requestLogoutUser: requestLogoutUser() };

const AppContainer = withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(App));

function ThemeWrapper() {
  return (
    <MuiThemeProvider theme={darkTheme}>
      <AppContainer />
    </MuiThemeProvider>
  );
}

export default ThemeWrapper;
