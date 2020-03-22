import React from "react";
import TextField from "@material-ui/core/TextField";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useTranslation } from "react-i18next";

const answerSelector = currentQuestion =>
  createSelector(
    state => state.quiz.questions,
    questions => questions.filter(question => question.positionInRound === currentQuestion.positionInRound)[0].answer
  );

function AnswerTextField(props) {
  const { question } = props;
  const { t } = useTranslation();

  const answer = useSelector(answerSelector(question));

  return (
    <TextField
      label={t('answer')}
      style={{ margin: 8, width: "80%" }}
      helperText={t('hannes')}
      margin="normal"
      variant="outlined"
      onChange={e => props.typeTextHandler(question.positionInRound, e)}
      value={answer}
    />
  );
}

export default AnswerTextField;
