import React from "react";
import { useDispatch, useSelector } from "react-redux";
import MobileStepper from "@material-ui/core/MobileStepper";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import TextQuestion from "./textQuestion";
import { setActiveQuestion } from "../redux/quizReducer";

function Quiz() {
  console.log("quiz has renderered");

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

  return (
    <React.Fragment>
      {questions.map(question => (
        <TextQuestion question={question}></TextQuestion>
      ))}
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
    </React.Fragment>
  );
}

export default Quiz;
