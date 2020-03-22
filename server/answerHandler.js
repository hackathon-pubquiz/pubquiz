const { QuestionSubmission } = require("./models");

class AnswerHandler {
  constructor(websocketHandler) {
    this.websocketHandler = websocketHandler;
  }

  onUpdate = async (ownSocket, data) => {
    // data.groupId
    // data.questionId
    // data.answerText

    console.log("Incomming answer:" + JSON.stringify(data));
    const [submission, created] = await QuestionSubmission.findOrCreate({
      where: { groupId: data.groupId, positionInRound: data.positionInRound },
      defaults: {
        answer: data.answerText
      }
    });
    this.websocketHandler.sendMessage({ socket: ownSocket, room: null, eventName: "rec_message", data });
  };
}

module.exports = AnswerHandler;
