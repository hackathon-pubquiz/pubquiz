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
      data: {
        questionId: data.questionId,
        answer: submission
      }
    };
    this.websocketHandler.sendMessage({ socket: ownSocket, room: null, eventName: "action", data: broadcastPayload });
  };

  onLock = async (ownSocket, data) => {
    // data.questionId
    // data.groupId
    // data.userId
    const [submission, created] = await QuestionSubmission.findOrCreate({
      where: { groupId: data.groupId, questionId: data.questionId },
      defaults: {
        personId: data.userId
      }
    });
    if (!created) {
      submission.personId = data.userId;
      await submission.save();
    }

    const broadcastPayload = {
      type: "update_answer_from_ws",
      data: {
        questionId: data.questionId,
        answer: submission
      }
    };
    this.websocketHandler.sendMessage({ socket: ownSocket, room: null, eventName: "action", data: broadcastPayload });
  };

  onRelease = async (ownSocket, data) => {
    // data.questionId
    // data.groupId
    // data.userId
    const [submission, created] = await QuestionSubmission.findOrCreate({
      where: { groupId: data.groupId, questionId: data.questionId },
      defaults: {
        answer: "",
        personId: null
      }
    });
    if (!created) {
      submission.personId = null;
      await submission.save();
    }

    const broadcastPayload = {
      type: "update_answer_from_ws",
      data: {
        questionId: data.questionId,
        answer: submission
      }
    };
    this.websocketHandler.sendMessage({
      socket: ownSocket,
      room: null,
      eventName: "action",
      data: broadcastPayload
    });
  };
}

module.exports = AnswerHandler;
