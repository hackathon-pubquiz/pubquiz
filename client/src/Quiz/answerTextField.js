import React from "react";
import TextField from "@material-ui/core/TextField";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { lockAnswerForMyself } from "../redux/quizReducer";

// const answerSelector = currentQuestion => createSelector(state => state.quiz.answers[currentQuestion.id]);

function AnswerTextField(props) {
  const { question, socket } = props;

  const answer = useSelector(state => state.quiz.answers[question.id]);
  const dispatch = useDispatch();

  const lockAnswer = () => {
    dispatch(lockAnswerForMyself(question.id));
    socket.emit("lock_answer", { questionId: question.id });
  };

  const releaseAnswer = () => {
    socket.emit("release_answer", { questionId: question.id });
  };

  return (
    <TextField
      label="Anwort"
      style={{ margin: 8, width: "80%" }}
      helperText="Hannes tippt gerade..."
      margin="normal"
      variant="outlined"
      onChange={e => props.typeTextHandler(question.id, e)}
      onFocus={lockAnswer}
      onBlur={releaseAnswer}
      value={answer && answer.text}
    />
  );
}

export default AnswerTextField;
