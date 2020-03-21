import React from "react";
import Message from "./Message";
import { List } from "@material-ui/core";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";

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
        <List dense={true}>
          {messageLog.map((m, i) => (
            <Message
              message={m}
              key={i}
              id={i}
              showText={this.props.open}
              ownMessage={m.nickname == ownNickname}
            ></Message>
          ))}
        </List>
        {this.props.open && (
          <form onSubmit={this.handleSubmit}>
            <TextField label="Sag was!" onChange={this.handleChange} />
          </form>
        )}
      </div>
    );
  }
}

const ChatWrapperContainer = connect(mapStateToProps, {})(ChatWrapper);

export default ChatWrapperContainer;
