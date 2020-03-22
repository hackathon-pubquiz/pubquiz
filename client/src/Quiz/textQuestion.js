import React from "react";
import { Paper } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { withStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

const styles = theme => ({
  questionWrapper: {
    textAlign: "center"
  }
});

const answerSelector = currentQuestion =>
  createSelector(
    state => state.quiz.questions,
    questions => questions.filter(question => question.positionInRound == currentQuestion.positionInRound)[0].answer
  );

function TextQuestion(props) {
  const { question, classes } = props;

  const answer = useSelector(answerSelector(question));

  return (
    <Paper className={classes.questionWrapper}>
      <Typography variant="h2">Frage #{question.positionInRound}</Typography>
      <Box fontSize="h5.fontSize">{question.question}</Box>
      <TextField
        label="Anwort"
        style={{ margin: 8, width: "80%" }}
        helperText="Hannes tippt gerade..."
        margin="normal"
        variant="outlined"
        onChange={e => props.typeTextHandler(question.positionInRound, e)}
        value={answer}
      />
    </Paper>
  );
}

export default withStyles(styles)(TextQuestion);
