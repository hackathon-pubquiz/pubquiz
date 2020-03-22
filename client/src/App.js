import React, { useState } from "react";
import { BrowserRouter as Router, Link as RouterLink, Route, Switch } from "react-router-dom";
import io from "socket.io-client";
import clsx from "clsx";
import { withTranslation } from 'react-i18next';

import ChatWrapper from "./TextChat/ChatWrapper";
import Groups from "./Groups";
import Persons from "./Persons";
import QuizMaster from "./pages/QuizMaster";
import { darkTheme } from "./Themes";
import { AppBar, MuiThemeProvider, Tab, Tabs, withStyles } from "@material-ui/core";
import RegisterUserScreen from "./components/RegisterUserScreen";
import RegisterTeamScreen from "./components/RegisterTeamScreen";
import CheerBackdrop from "./components/CheerBackdrop";
import Quiz from "./Quiz/quiz";
import HostQuizzes from "./components/HostQuizzes";
import HostQuiz from "./components/HostQuiz";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./redux/rootReducer.js";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { sessionService } from "redux-react-session";
import createSocketIoMiddleware from "redux-socket.io";

import { connect, useDispatch } from "react-redux";
import { requestLoginUser, requestLogoutUser } from "./redux/sessions";
import Pubs from "./Pubs";
import CssBaseline from "@material-ui/core/CssBaseline";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Drawer from "@material-ui/core/Drawer";
import ChatIcon from "@material-ui/icons/Chat";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import moment from "moment";
import "moment/locale/de";
import MomentUtils from "@date-io/moment";
import {Web} from "@material-ui/icons";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import {setSocketId} from "./redux/socketReducer";

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
    paddingTop: theme.spacing(9),
    height: "100vh",
    paddingRight: theme.spacing(2)
  },
  contentDrawerClosed: {
    paddingLeft: drawerClosedWidth(theme) + theme.spacing(2),
    transition: drawerTransition(theme, "padding-left", false)
  },
  contentDrawerOpen: {
    paddingLeft: drawerOpenWidth + theme.spacing(2),
    transition: drawerTransition(theme, "padding-left", true)
  },
  formControl: {
    justifyContent: "center"
  }
});

class App extends React.Component {
  componentDidMount() {
    socket.on('connect', () => {
      this.props.setSocketId(socket.id);
    });

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

    const { classes, t, i18n } = this.props;

    const changeLanguage = event => {
      console.log(event.target.value);
      i18n.changeLanguage(event.target.value);
    };

    const open = this.state.open;
    return (
      <Router>
        <CssBaseline />
        <CheerBackdrop socket={socket} />

        <AppBar
          position="static"
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open
          })}
        >
          <Tabs component="nav" value={false}>
            {this.props.loggedInUser.id ? (
              <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} edge="start">
                <ChatIcon />
              </IconButton>
            ) : null}
            <Tab component={RouterLink} to="/groups/1" label={t('groups')}></Tab>
            <Tab component={RouterLink} to="/people" label={t('people')}></Tab>
            <Tab component={RouterLink} to="/player" label={t('player')}>></Tab>
            <Tab component={RouterLink} to="/quizmaster/1" label={t('quizmaster')}></Tab>
            <Tab component={RouterLink} to="/host/quizzes/1" label={t('host')}></Tab>
            {this.props.authenticated ? (
              profileElement(this.props.loggedInUser.id)
            ) : (
              <Tab component={RouterLink} to="/login/1" label={t('login')}></Tab>
            )}
            <Tab component={RouterLink} to="/login2/1" label={t('login')}></Tab>
            <Tab component={RouterLink} to="/quiz/1" label={t('quiz')}></Tab>
            <FormControl className={classes.formControl}>
              <Select value={i18n.language} onChange={changeLanguage}>
                <MenuItem value={"de"}>de</MenuItem>
                <MenuItem value={"en"}>en</MenuItem>
              </Select>
            </FormControl>
          </Tabs>
        </AppBar>
        {this.props.loggedInUser.id ? (
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
        ) : null}
        <main
          className={clsx(classes.content, {
            [classes.contentDrawerOpen]: open,
            [classes.contentDrawerClosed]: !open
          })}
        >
          <Switch>
            <Route path="/login/:pubId">
              <RegisterUserScreen />
            </Route>
            <Route path="/login2/:pubId">
              <RegisterTeamScreen />
            </Route>
            <Route path="/pubs">
              <Pubs></Pubs>
            </Route>
            <Route path="/groups/:pubId">
              <Groups></Groups>
            </Route>
            <Route path="/people">
              <Persons></Persons>
            </Route>
            <Route path="/quizmaster/:pubId/:quizId?">
              <QuizMaster />
            </Route>
            <Route path="/host/quiz/:id">
              <HostQuiz socket={socket} />
            </Route>
            <Route path="/host/quizzes/:pubId" component={HostQuizzes} />
            <Route path="/quiz/:quizId">
              <Quiz socket={socket}></Quiz>
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

const mapDispatchToProps = { requestLogoutUser: requestLogoutUser(), setSocketId };

const AppContainer = withTranslation()(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(App)));

moment.locale("de");

function PickerUtilWrapper() {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils} locale="de">
      <AppContainer />
    </MuiPickersUtilsProvider>
  );
}

function ThemeWrapper() {
  return (
    <MuiThemeProvider theme={darkTheme}>
      <PickerUtilWrapper />
    </MuiThemeProvider>
  );
}

function ReduxWrapper() {
  let socketIoMiddleware = createSocketIoMiddleware(socket, "/socket.io/");
  const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk, socketIoMiddleware)));
  sessionService.initSessionService(store);
  return (
    <Provider store={store}>
      <ThemeWrapper></ThemeWrapper>
    </Provider>
  );
}

export default ReduxWrapper;
