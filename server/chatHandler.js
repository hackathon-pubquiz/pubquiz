class ChatHandler {

  constructor(websocketHandler) {
    this.websocketHandler = websocketHandler;
  }

  onIncomingChat = (ownSocket, data) => {
    // data.channel
    // data.nickname
    // data.message

    console.log('Incomming chat:' + JSON.stringify(data));

    this.websocketHandler.sendMessage({socket: ownSocket, room: null, eventName: 'rec_message', data});
  };
};

module.exports = ChatHandler;