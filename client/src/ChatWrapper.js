import React from "react";

class ChatWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {message: null, messageLog: []};
  }

  componentDidMount() {
    let {socket} = this.props;

    socket.on('rec_message', this.handleIncomingMessage);
  }

  handleIncomingMessage = ({nickname, message}) => {
    let {messageLog} = this.state;

    // TODO limit to last n-Messages
    messageLog = [...messageLog, {nickname, message}];

    this.setState({messageLog});
  };

  handleChange = (event) => {
    this.setState({'message': event.target.value});
  };

  handleSubmit = (event) => {
    event.preventDefault();

    let {socket} = this.props;
    let {message} = this.state;

    let nickname = 'TODO Nick';
    let channel = 'TODO Channel';

    if(message) {
      socket.emit('send_message', {nickname, channel, message});
    }
  };

  render() {

    let {messageLog} = this.state;

    return (
      <div>
        <div>Chat</div>
        <form onSubmit={this.handleSubmit}>
          <input type="text" onChange={this.handleChange} />
        </form>
        <div>
          {messageLog.map((m, i) => (
            <div key={i}>
              <span>{m.nickname}</span>: <span>{m.message}</span>
            </div>
          ))}
        </div>
      </div>);
  };
}

export default ChatWrapper;