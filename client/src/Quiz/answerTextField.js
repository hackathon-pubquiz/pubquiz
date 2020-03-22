import React from "react";
import TextField from "@material-ui/core/TextField";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

// const answerSelector = currentQuestion => createSelector(state => state.quiz.answers[currentQuestion.id]);

function AnswerTextField(props) {
  const { question } = props;

  const answer = useSelector(state => state.quiz.answers[question.id]);

  return (
    <TextField
      label="Anwort"
      style={{ margin: 8, width: "80%" }}
      helperText="Hannes tippt gerade..."
      margin="normal"
      variant="outlined"
      onChange={e => props.typeTextHandler(question.id, e)}
      value={answer && answer.text}
    />
  );
}

export default AnswerTextField;
