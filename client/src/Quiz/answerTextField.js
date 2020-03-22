import React from "react";
import TextField from "@material-ui/core/TextField";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { lockAnswerForMyself } from "../redux/quizReducer";
import { useTranslation } from "react-i18next";

// const answerSelector = currentQuestion => createSelector(state => state.quiz.answers[currentQuestion.id]);

function AnswerTextField(props) {
  const { question, socket } = props;
  const { t } = useTranslation();

  const answer = useSelector(state => state.quiz.answers[question.id]);
  const userId = useSelector(state => state.session.user.id);
  const groupId = useSelector(state => state.session.user.group.id);
  const dispatch = useDispatch();

  const lockAnswer = () => {
    dispatch(lockAnswerForMyself(question.id));
    socket.emit("lock_answer", { questionId: question.id, userId: userId, groupId: groupId });
  };

  const releaseAnswer = () => {
    socket.emit("release_answer", { questionId: question.id, userId: userId, groupId: groupId });
  };

  const helperText =
    answer && answer.personId !== null && answer.personId !== userId ? t("someoneIsTyping", { name: "Kollege" }) : "";

  return (
    <TextField
      label={t("answer")}
      style={{ margin: 8, width: "80%" }}
      helperText={helperText}
      margin="normal"
      variant="outlined"
      onChange={e => props.typeTextHandler(question.id, e)}
      onFocus={lockAnswer}
      onBlur={releaseAnswer}
      value={answer && answer.answer}
    />
  );
}

export default AnswerTextField;
