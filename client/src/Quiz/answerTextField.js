import React from "react";
import TextField from "@material-ui/core/TextField";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

const answerSelector = currentQuestion =>
  createSelector(
    state => state.quiz.questions,
    questions => questions.filter(question => question.positionInRound === currentQuestion.positionInRound)[0].answer
  );

function AnswerTextField(props) {
  const { question } = props;

  const answer = useSelector(answerSelector(question));

  return (
    <TextField
      label="Anwort"
      style={{ margin: 8, width: "80%" }}
      helperText="Hannes tippt gerade..."
      margin="normal"
      variant="outlined"
      onChange={e => props.typeTextHandler(question.positionInRound, e)}
      value={answer}
    />
  );
}

export default AnswerTextField;
