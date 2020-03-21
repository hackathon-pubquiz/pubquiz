const SET_ACTIVE_QUESTION = "SET_ACTIVE_QUESTION";
export function setActiveQuestion(index) {
  return {
    type: SET_ACTIVE_QUESTION,
    activeQuestion: index
  };
}

export function quizReducer(
  state = {
    questions: [{ title: "q1" }, { title: "q2" }, { title: "q3" }],
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
