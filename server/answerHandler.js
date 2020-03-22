class AnswerHandler {
  constructor(websocketHandler) {
    this.websocketHandler = websocketHandler;
  }

  onUpdate = (ownSocket, data) => {
    // data.channel
    // data.nickname
    // data.message

    console.log("Incomming answer:" + JSON.stringify(data));

    this.websocketHandler.sendMessage({ socket: ownSocket, room: null, eventName: "rec_message", data });
  };
}

module.exports = AnswerHandler;
