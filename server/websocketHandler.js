const { Quiz } = require("./models");
const ChatHandler = require("./chatHandler");
const AnswerHandler = require("./answerHandler");

class WebsocketHandler {
  constructor(io) {
    this.io = io;

    this.clients = {};

    this.chatHandler = new ChatHandler(this);
    this.answerHandler = new AnswerHandler(this);

    this.io.on("connection", socket => {
      socket.on("send_message", data => this.chatHandler.onIncomingChat(socket, data));
      socket.on("send_cheer", data => this.chatHandler.onIncomingCheer(socket));
      socket.on("write_answer", data => this.answerHandler.onUpdate(socket, data));
      socket.on("start_quiz", data => {
        console.log("got start_quiz with id " + data);
        socket.broadcast.emit("quiz_started", data);
        Quiz.findByPk(data).then(result => socket.broadcast.emit("action", { type: "quiz_started", data: result }));
      });

      socket.on("disconnect", () => {
        // ...
      });
    });
  }

  sendMessage = ({ socket, room, eventName, data }) => {
    if (socket.id === room) {
      this.io.to(room).emit(eventName, data);
    }

    if (room) {
      socket.to(room).emit(eventName, data);
    } else {
      socket.broadcast.emit(eventName, data);
    }
  };
}

module.exports = WebsocketHandler;
