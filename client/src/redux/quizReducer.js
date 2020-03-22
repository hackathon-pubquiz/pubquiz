import { send } from "@giantmachines/redux-websocket";

const SET_ACTIVE_QUESTION = "SET_ACTIVE_QUESTION";
export function setActiveQuestion(index) {
  return {
    type: SET_ACTIVE_QUESTION,
    activeQuestion: index
  };
}

export function updateAnswer(groupId, questionId, answer) {
  return function(dispatch) {
    dispatch(send({ update: "update" }, "update"));
    dispatch(updateAnswerInStore(groupId, questionId, answer));
  };
}

const UPDATE_ANSWER_IN_STORE = "UPDATE_ANSWER_IN_STORE";
export function updateAnswerInStore(groupId, questionId, answer) {
  return {
    type: UPDATE_ANSWER_IN_STORE,
    answer: answer,
    questionId: questionId
  };
}

export function quizReducer(
  state = {
    quizId: 0,
    questions: [
      { id: 0, positionInRound: 1, question: "Was ist das?", type: "text", questionExternalLink: "", answer: "" },
      { id: 1, positionInRound: 2, question: "Wo ist das?", type: "text", questionExternalLink: "", answer: "" },
      { id: 2, positionInRound: 3, question: "Wer ist das?", type: "text", questionExternalLink: "", answer: "" },
      {
        positionInRound: 4,
        question: "Wie heißt der Song?",
        type: "song",
        questionExternalLink: "https://www.youtube.com/watch?v=z9Uz1icjwrM",
        answer: ""
      }
    ],
    activeQuestion: 0
  },
  action
) {
  switch (action.type) {
    case SET_ACTIVE_QUESTION:
      return Object.assign({}, state, {
        activeQuestion: action.activeQuestion
      });
    case UPDATE_ANSWER_IN_STORE:
      const updatedQuestions = [];
      for (const idx in state.questions) {
        const question = state.questions[idx];

        if (question.questionId == action.questionId) {
          const modifiedQuestion = Object.assign({}, question, {
            answer: action.answer
          });
          updatedQuestions.push(modifiedQuestion);
        } else {
          updatedQuestions.push(question);
        }
      }
      return Object.assign({}, state, { questions: updatedQuestions });
    case "quiz_started":
      console.log("Penis");
      console.log(action);
      const questions = action.data.questions.slice();
      console.log(questions);

      return Object.assign({}, state, {
        quizId: action.data.id,
        questions: questions
      });
    default:
      return state;
  }
}
