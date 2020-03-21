const ChatHandler = require('./chatHandler');

class WebsocketHandler {
  constructor(io) {
    this.io = io;

    this.clients = {};

    this.chatHandler = new ChatHandler(this);

    this.io.on('connection', (socket) => {
      this.clients[socket.id] = socket;

      socket.on('send_message', this.chatHandler.onIncomingChat);

      socket.on('disconnect', () => {
        delete this.clients[socket.id];
      });
    });
  }

  sendMessage = ({eventName, data}) => {
    console.debug(Object.keys(this.clients));

    for (let socketId in this.clients) {
      this.clients[socketId].emit(eventName, data);
    }
  }
};

module.exports = WebsocketHandler;