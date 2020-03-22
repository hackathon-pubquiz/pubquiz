const { QuestionSubmission } = require("./models");

class AnswerHandler {
  constructor(websocketHandler) {
    this.websocketHandler = websocketHandler;
  }

  onUpdate = async (ownSocket, data) => {
    // data.groupId
    // data.questionId
    // data.answerText

    const [submission, created] = await QuestionSubmission.findOrCreate({
      where: { groupId: data.groupId, questionId: data.questionId },
      defaults: {
        answer: data.answerText
      }
    });
    if (!created) {
      submission.answer = data.answerText;
      await submission.save();
    }

    const broadcastPayload = {
      type: "update_answer_from_ws",
      data: data
    };
    this.websocketHandler.sendMessage({ socket: ownSocket, room: null, eventName: "action", data: broadcastPayload });
  };
}

module.exports = AnswerHandler;
