import React from "react";
import { useDispatch, useSelector } from "react-redux";
import MobileStepper from "@material-ui/core/MobileStepper";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import AnswerTextField from "./answerTextField";
import AudioQuestion from "./audioQuestion";
import PictureQuestion from "./pictureQuestion";
import { setActiveQuestion, updateAnswer } from "../redux/quizReducer";
import SwipeableViews from "react-swipeable-views";
import { Paper, Grid } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { withStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";

const styles = theme => ({
  questionWrapper: {
    textAlign: "center",
    height: "100%"
  },
  grid: {
    height: "100%"
  },
  gridItemExternalLink: {
    height: "400px",
    display: "flex",
    justifyContent: "center"
  }
});

function Quiz(props) {
  const { classes } = props;
  const { t } = useTranslation();
  const activeStep = useSelector(state => state.quiz.activeQuestion);
  const totalNumberOfSteps = useSelector(state => state.quiz.questions.length);
  const questions = useSelector(state => state.quiz.questions);

  const dispatch = useDispatch();
  const socket = props.socket;

  const handleNext = () => {
    dispatch(setActiveQuestion(activeStep + 1));
  };

  const handleBack = () => {
    dispatch(setActiveQuestion(activeStep - 1));
  };

  const handleStepChange = step => {
    dispatch(setActiveQuestion(step));
  };

  const typeText = (questionId, e) => {
    const answerText = e.target.value;
    const groupId = 1;
    dispatch(updateAnswer(groupId, questionId, answerText));
    socket.emit("write_answer", { groupId, questionId, answerText });
  };

  const handleTip = () => {
    window.open("https://www.sandbox.paypal.com/us/signin", "Paypal");
  };

  return (
    <React.Fragment>
      <SwipeableViews axis="x" index={activeStep} onChangeIndex={handleStepChange} enableMouseEvents>
        {questions.map(question => (
          <Paper className={classes.questionWrapper}>
            <Grid className={classes.grid} container direction="column">
              <Grid item>
                <Typography variant="h2">{t("questionHeader", {number: question.positionInRound})}</Typography>
              </Grid>
              <Grid item>
                <Box fontSize="h5.fontSize">{question.question}</Box>
              </Grid>
              <Grid item className={classes.gridItemExternalLink}>
                {question.type === "song" ? <AudioQuestion question={question}></AudioQuestion>: ''}
                {question.type === "picture" ? <PictureQuestion question={question}></PictureQuestion>: ''}
              </Grid>
              <Grid item>
                <AnswerTextField question={question} typeTextHandler={typeText}></AnswerTextField> 
              </Grid>
            </Grid>
          </Paper>
        ))}
      </SwipeableViews>
      <MobileStepper
        variant="dots"
        steps={totalNumberOfSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === totalNumberOfSteps - 1}>
            {t("next")} <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft />
            {t("previous")} 
          </Button>
        }
      />
      <Button variant="contained" onClick={handleTip}>
        {t("tip")} 
      </Button>
    </React.Fragment>
  );
}

export default withStyles(styles)(Quiz);
