class ChatHandler {
  
  constructor(socket) {
    this.socket = socket;
    
    this.socket.on('connection', (client) => {
      client.on('chat_message', this.onIncomingChat);
      //client.on('disconnect', () => { /* … */ });
    });
  }
  
  onIncomingChat = (data) => {
    // data.channel
    // data.nickname
    // data.text
    
    console.log('Log!');
  };
};

module.exports = ChatHandler;