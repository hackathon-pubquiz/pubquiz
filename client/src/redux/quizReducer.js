const SET_ACTIVE_QUESTION = "SET_ACTIVE_QUESTION";
export function setActiveQuestion(index) {
  return {
    type: SET_ACTIVE_QUESTION,
    activeQuestion: index
  };
}

export function quizReducer(
  state = {
    questions: [
      { positionInRound: 1, question: "Was ist das?" },
      { positionInRound: 2, question: "Wo ist das?" },
      { positionInRound: 3, question: "Wer ist das?" }
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
    default:
      return state;
  }
}
