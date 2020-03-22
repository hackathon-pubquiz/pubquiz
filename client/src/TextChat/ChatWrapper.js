import React from "react";
import Message from "./Message";
import { TextField, List, Button } from "@material-ui/core";
import { LocalBar} from '@material-ui/icons';
import { connect } from "react-redux";
import {withStyles} from "@material-ui/core/styles";

const styles = theme => ({
  root: {},
  control: {
    margin: theme.spacing(2),
  },
  controlElement: {
    'margin-top': theme.spacing(2),
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

    let channel = "TODO Channel";

    this.props.socket.emit("send_cheer", { channel });
  };

  handleSubmit = event => {
    event.preventDefault();

    let { socket } = this.props;
    let { message } = this.state;

    let nickname = "TODO Nick";
    let channel = "TODO Channel";

    if (message) {
      this.addMessage({ nickname, message });
      socket.emit("send_message", { nickname, channel, message });
    }
  };

  render() {
    let { messageLog } = this.state;
    let ownNickname = "TODO Nick";
    return (
      <div>
        {this.props.open ? (
          <div className={this.props.classes.control}>
            <Button
              fullWidth
              variant="contained"
              onClick={this.handleCheer}
              className={this.props.classes.controlElement}
            >
              Prost! <LocalBar /> &#127867;
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
                label="Sag was!"
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

const ChatWrapperContainer = connect(mapStateToProps, {})(withStyles(styles)(ChatWrapper));

export default ChatWrapperContainer;
