class ChatHandler {

  constructor(websocketHandler) {
    this.websocketHandler = websocketHandler;
  }

  onIncomingChat = (data) => {
    // data.channel
    // data.nickname
    // data.message

    console.log('Incomming chat:' + JSON.stringify(data));

    this.websocketHandler.sendMessage({eventName: 'rec_message', data});
  };
};

module.exports = ChatHandler;