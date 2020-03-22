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

  onIncomingCheer = (ownSocket, data) => {
    this.websocketHandler.sendMessage({socket: ownSocket, room: null, eventName: 'rec_cheer'});
    // self send the cheer ;)
    this.websocketHandler.sendMessage({socket: ownSocket, room: ownSocket.id, eventName: 'rec_cheer'});
  };
};

module.exports = ChatHandler;