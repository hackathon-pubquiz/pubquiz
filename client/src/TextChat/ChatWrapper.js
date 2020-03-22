import React from "react";
import clsx from "clsx";
import Message from "./Message";
import { TextField, List, Button } from "@material-ui/core";
import { connect } from "react-redux";
import {withStyles} from "@material-ui/core/styles";
import { ReactComponent as CocktailIcon } from "../img/cocktail.svg";
import { ReactComponent as PintIcon } from "../img/pint.svg";
import { withTranslation } from 'react-i18next';
import {getGroup} from "../redux/groupApi";

const styles = theme => ({
  root: {},
  control: {
    margin: theme.spacing(2),
  },
  controlElement: {
    'margin-top': theme.spacing(2),
  },
  icon: {
    'width': '1.5rem',
    'height': '1.5rem',
  },
  leftIcon: {
    transform: 'rotate(10deg)',
  },
  rightIcon: {
    transform: 'rotate(-10deg)',
  }
});

const mapStateToProps = state => {
  return { usedId: state.session.user };
};

class ChatWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: null,
      messageLog: [
        { nickname: "Hannes", message: "Was geht bei euch?" },
        { nickname: "Vera", message: "Alles locker :)" },
        { nickname: "Tom", message: "Können wir emojis?" }
      ]
    };
  }

  componentDidMount() {
    let { socket } = this.props;

    socket.on("rec_message", this.handleIncomingMessage);
  }

  addMessage = ({ nickname, message }) => {
    let { messageLog } = this.state;

    // TODO limit to last n-Messages
    messageLog = [...messageLog, { nickname, message }];

    this.setState({ messageLog });
  };

  handleIncomingMessage = ({ nickname, message }) => {
    this.addMessage({ nickname, message });
  };

  handleChange = event => {
    this.setState({ message: event.target.value });
  };

  handleCheer = event => {
    event.preventDefault();

    this.getRoomName().then((room) => {
      this.props.socket.emit("send_cheer", { room });
    });
  };

  getRoomName = () => {
    return getGroup().then((group) => {
      return group ? 'group-' + group.id : "no-op";
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    let { socket } = this.props;
    let { message } = this.state;

    let nickname = "TODO Nick";

    if (message) {
      this.addMessage({ nickname, message });
      this.getRoomName().then((room) => {
        socket.emit("send_message", { nickname, room, message });
      });
    }
  };

  render() {
    let { messageLog } = this.state;
    let {classes, t} = this.props;
    let ownNickname = "TODO Nick";
    return (
      <div>
        {this.props.open ? (
          <div className={classes.control}>
            <Button
              fullWidth
              variant="contained"
              onClick={this.handleCheer}
              className={classes.controlElement}
            >
              {t("prost")}
              <CocktailIcon className={clsx(classes.icon, classes.leftIcon)} />
              <PintIcon className={clsx(classes.icon, classes.rightIcon)} />
            </Button>
          </div>
        ) : null}
        <List dense={true}>
          {messageLog.map((m, i) => (
            <Message
              message={m}
              key={i}
              id={i}
              showText={this.props.open}
              ownMessage={m.nickname === ownNickname}
            />
          ))}
        </List>
        {this.props.open && (
          <div className={this.props.classes.control}>
            <form onSubmit={this.handleSubmit}>
              <TextField
                fullWidth
                label={t("chatLabel")}
                onChange={this.handleChange}
                className={this.props.classes.controlElement}
              />
            </form>
          </div>
        )}
      </div>
    );
  }
}

const ChatWrapperContainer = connect(mapStateToProps, {})(withTranslation()(withStyles(styles)(ChatWrapper)));

export default ChatWrapperContainer;
