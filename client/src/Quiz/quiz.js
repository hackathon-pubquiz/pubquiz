import React from "react";
import { useDispatch, useStore } from "react-redux";
import MobileStepper from "@material-ui/core/MobileStepper";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";

function Quiz() {
  const state = useStore().getState();
  const activeStep = state.quiz.activeQuestion;
  const totalNumberOfSteps = state.quiz.questions.length;

  const handleNext = () => {
    // setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    // setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  return (
    <MobileStepper
      variant="dots"
      steps={totalNumberOfSteps}
      position="static"
      activeStep={activeStep}
      nextButton={
        <Button size="small" onClick={handleNext} disabled={activeStep === totalNumberOfSteps}>
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
  );
}

export default Quiz;
