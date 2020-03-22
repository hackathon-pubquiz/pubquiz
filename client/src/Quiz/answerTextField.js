import React from "react";
import TextField from "@material-ui/core/TextField";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useTranslation } from "react-i18next";

// const answerSelector = currentQuestion => createSelector(state => state.quiz.answers[currentQuestion.id]);

function AnswerTextField(props) {
  const { question } = props;
  const { t } = useTranslation();

  const answer = useSelector(state => state.quiz.answers[question.id]);

  return (
    <TextField
      label={t('answer')}
      style={{ margin: 8, width: "80%" }}
      helperText={t('hannes')}
      margin="normal"
      variant="outlined"
      onChange={e => props.typeTextHandler(question.id, e)}
      value={answer && answer.text}
    />
  );
}

export default AnswerTextField;
