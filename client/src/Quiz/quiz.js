import React from "react";
import { useDispatch, useSelector } from "react-redux";
import MobileStepper from "@material-ui/core/MobileStepper";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import TextQuestion from "./textQuestion";
import AudioQuestion from "./audioQuestion";
import { setActiveQuestion } from "../redux/quizReducer";
import SwipeableViews from "react-swipeable-views";
import { Paper } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { withStyles } from "@material-ui/core";

const styles = theme => ({
  questionWrapper: {
    textAlign: "center"
  }
});

function Quiz(props) {
  const { classes } = props;
  const activeStep = useSelector(state => state.quiz.activeQuestion);
  const totalNumberOfSteps = useSelector(state => state.quiz.questions.length);
  const questions = useSelector(state => state.quiz.questions);

  const dispatch = useDispatch();

  const handleNext = () => {
    dispatch(setActiveQuestion(activeStep + 1));
  };

  const handleBack = () => {
    dispatch(setActiveQuestion(activeStep - 1));
  };

  const handleStepChange = step => {
    dispatch(setActiveQuestion(step));
  };

  const handleTip = () => {
    window.open("https://www.sandbox.paypal.com/us/signin", "Paypal");
  }

  return (
    <React.Fragment>
      <SwipeableViews axis="x" index={activeStep} onChangeIndex={handleStepChange} enableMouseEvents>
        {questions.map(question => (
          <Paper className={classes.questionWrapper}>
          <Typography variant="h2">Frage #{question.positionInRound}</Typography>
          <Box fontSize="h5.fontSize">{question.question}</Box>
              {question.type === "text" ? 
                <TextQuestion question={question}></TextQuestion> : 
                <AudioQuestion question={question}></AudioQuestion>}
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
            Vor <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft />
            Zurück
          </Button>
        }
      />
      <Button 
        variant="contained" onClick={handleTip}>
          Trinkgeld
        </Button>
    </React.Fragment>
  );
}

export default withStyles(styles)(Quiz);
