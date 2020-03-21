export function quizReducer(
  state = {
    questions: [{ title: "q1" }, { title: "q2" }, { title: "q3" }],
    activeQuestion: 0
  },
  action
) {
  switch (action.type) {
    default:
      return state;
  }
}
