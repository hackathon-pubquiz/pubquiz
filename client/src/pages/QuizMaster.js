import React from "react";
import {withRouter} from "react-router";
import {withStyles} from "@material-ui/core/styles";
import {TextField, Button, Grid, Typography, Fab, Slider} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import MobileStepper from "@material-ui/core/MobileStepper";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import {DateTimePicker} from "@material-ui/pickers";
import moment from "moment";
import Header from "../components/Header";


const questionStyles = theme => ({
  question: {
    "& > *": {
      marginLeft: "1em",
      marginRight: "1em",
      "&:first-child": {
        marginLeft: 0,
      },
      "&:last-child": {
        marginRight: 0,
      },
    },
  },
});

function makeEmptyQuestion () {
  return {question: "", answer: "", link: ""};
}

const Question = withStyles(questionStyles)(props => {
  const { roundId, questionId, onChange, onRemove, questionObj, classes } = props;
  const { question, link, answer } = questionObj;

  const changeHandler = (event) => {
    const attr = event.target.id.split('-')[0];
    let update = {};
    update[attr] = event.target.value;
    if (onChange != null) onChange({...questionObj, ...update});
  };

  const deleteHandler = () => {
    if (onRemove != null) onRemove();
  };

  return (
    <Grid container wrap="nowrap" alignItems="center" className={classes.question}>
      <Grid item>
        <Typography variant="h6">
          {questionId + 1}.
        </Typography>
      </Grid>
      <Grid item container direction="column">
        <Grid item>
          <TextField
            fullWidth
            required
            label="Frage eingeben"
            id={`question-${roundId}-${questionId}`}
            value={question}
            onChange={changeHandler}
          />
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            label="Externer Link"
            id={`link-${roundId}-${questionId}`}
            value={link}
            onChange={changeHandler}
          />
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            label="Korrekte Antwort eingeben"
            id={`answer-${roundId}-${questionId}`}
            value={answer}
            onChange={changeHandler}
          />
        </Grid>
      </Grid>
      <Grid item>
        <Fab color="secondary" size="small" onClick={deleteHandler}>
          <DeleteForeverIcon />
        </Fab>
      </Grid>
    </Grid>
  );
});


const roundStyles = theme => ({
  main: {
    height: "100%",
    "& > *": {
      marginLeft: "1em",
      marginRight: "1em",
      "&:last-child": {
        margin: 0,
      },
    },
  },
  fabWrapper: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginTop: "1em",
    marginBottom: "1em",
  },
});

const Round = withStyles(roundStyles)(props => {
  const { roundId, onChange, onRemove, questionObjs, duration, className, classes } = props;

  const changeHandler = (questionId) => (questionProps) => {
    let newQuestionObjects = [...questionObjs];
    newQuestionObjects[questionId] = questionProps;
    if (onChange != null) onChange({duration: duration, questions: newQuestionObjects});
  };

  const removeHandler = (idx) => () => {
    let newQuestionObjects = [...questionObjs];
    newQuestionObjects.splice(idx, 1);
    if (onChange != null) onChange({duration: duration, questions: newQuestionObjects});
  };

  const addHandler = () => {
    if (onChange != null) onChange({
      duration: duration,
      questions: [...questionObjs, makeEmptyQuestion()],
    });
  };

  const deleteHandler = () => {
    if (onRemove != null) onRemove();
  };

  const durationChangeHandler = (event, newValue) => {
    if (onChange != null) onChange({duration: newValue, questions: questionObjs})
  };

  return (
    <Grid container direction="column" className={`${className} ${classes.main}`} wrap="nowrap">
      <Grid item>
        <Typography variant="h5">
          Runde {roundId + 1}
        </Typography>
      </Grid>
      <Grid item>
        <Slider
          value={duration}
          getAriaValueText={() => `${duration} Minuten`}
          aria-labelledby="duration-slider"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={1}
          max={10}
          onChange={durationChangeHandler}
        />
        <Typography id="duration-slider" gutterBottom>
          Rundendauer: {duration} Minute{duration !== 1 ? 'n' : ''}
        </Typography>
      </Grid>
      <Grid item>
        {
          questionObjs.map((questionObj, idx) =>
            <Question key={idx} roundId={roundId} questionId={idx} questionObj={questionObj} onChange={changeHandler(idx)} onRemove={removeHandler(idx)} />
          )
        }
      </Grid>
      <Grid item className={classes.fabWrapper}>
        <Fab color="primary" aria-label="add" size="small" variant="extended" onClick={addHandler}>
          <AddIcon />
          Frage hinzufügen
        </Fab>
      </Grid>
      <Grid item>
        <Button variant="contained" onClick={deleteHandler} color="secondary" fullWidth>
          <DeleteForeverIcon /> Runde löschen
        </Button>
      </Grid>
    </Grid>
  );
});


const quizMasterStyles = theme => ({
  main: {
    height: "100%",
  },
  mainGrid: {
    height: "100%",
  },
  dateWrapper: {
    padding: "0 .4rem",
    "& > *": {
      margin: "0 .4rem",
    },
  },
  roundWrapper: {
    flexGrow: 1,
    flexShrink: 1,
    overflowY: "auto"
  },
  round: {
    height: "100%",
  },
});

class QuizMaster extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rounds: [],
      activeRound: null,
      startDateTime: moment.now(),
      successMessage: null,
    };
  }

  onSubmit = (event) => {
    event.preventDefault();

    let {pubId, quizId} = this.props.match.params;
    let {date, rounds} = this.state;
    let collectedQuestions = [];
    console.log(rounds);
    for (let roundIdx in rounds) {
      const {duration, questions} = rounds[roundIdx];
      // TODO: duration is not supported by server yet
      for (let questionIdx in questions) {
        const question = questions[questionIdx];
        collectedQuestions.push({
          round: roundIdx,
          positionInround: questionIdx,
          question: question.question,
          questionExternalLink: question.link,
          correctAnswer: question.answer,
        });
      }
    }

    fetch("/api/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({pubId, quizId, date: this.state.startDateTime, questions: collectedQuestions})
    })
      .then(response => response.json())
      .then(response => {
        console.log(JSON.stringify(response));

        this.setState({successMessage: 'Daten wurde erfolgreich gepspeichert'});

        if(!quizId) {
          this.props.history.push(this.props.history.location.pathname + '/' + response.quizId);
        }
      })
      .catch(error => {
        console.error("Error:", error);
      });

  };


  roundChangeHandler = (idx) => ({questions, duration}) => {
    let newRounds = [...this.state.rounds];
    newRounds[idx] = {duration, questions};
    console.log(newRounds);
    this.setState({rounds: newRounds});
  };

  roundRemoveHandler = (idx) => () => {
    let stateUpdate = {rounds: [...this.state.rounds]};
    stateUpdate.rounds.splice(idx, 1);
    if (!stateUpdate.rounds.length) {
      stateUpdate['activeRound'] = null;
    } else if (this.state.activeRound >= stateUpdate.rounds.length) {
      stateUpdate['activeRound'] = stateUpdate.rounds.length - 1;
    }
    this.setState(stateUpdate);
  };

  roundAddHandler = () => {
    this.setState({
      rounds: [
        ...this.state.rounds,
        {
          duration: 5,
          questions: Array(3).fill(makeEmptyQuestion()),
        },
      ],
      activeRound: this.state.rounds.length,
    })
  };

  onDateChange = (dateTime) => {
    console.log(dateTime);
    this.setState({startDateTime: dateTime});
  };

  render() {
    const {classes} = this.props;
    const {questions, successMessage, inputState} = this.state;

    const numRounds = this.state.rounds.length;
    const activeRound = this.state.activeRound;
    const round = this.state.rounds[activeRound];
    const canGoRight = activeRound != null && activeRound < numRounds - 1;
    const canGoLeft = activeRound != null && activeRound > 0;

    console.log(numRounds, activeRound, canGoLeft, canGoRight);

    return (
      <form action="/" method="POST" noValidate autoComplete="off" onSubmit={this.onSubmit} className={classes.main}>
        <Grid container direction="column" className={classes.mainGrid} wrap="nowrap">
          <Header compact />
          <Grid item container justify="space-between" alignItems="center" wrap="nowrap" className={classes.dateWrapper}>
            <Grid item>
              <DateTimePicker ampm={false} disablePast label="Quizbeginn" value={this.state.startDateTime} onChange={this.onDateChange} />
            </Grid>
            <Grid item>
              <Button type="submit" variant="contained">Speichern</Button>
            </Grid>
          </Grid>
          <Grid item className={classes.roundWrapper}>
            {
              numRounds ?
                <Round
                  key={activeRound} roundId={activeRound} questionObjs={round.questions} duration={round.duration} className={classes.round}
                  onChange={this.roundChangeHandler(activeRound)} onRemove={this.roundRemoveHandler(activeRound)}
                />
                :
                <div className={classes.round}/>
            }
          </Grid>
          <Grid item>
            <MobileStepper
              variant="dots"
              steps={numRounds}
              position="static"
              activeStep={activeRound}
              nextButton={
                <Button size="small" onClick={() => this.setState({activeRound: activeRound + 1})} disabled={!canGoRight}>
                  Vor
                  <KeyboardArrowRight />
                </Button>
              }
              backButton={
                <Button size="small" onClick={() => this.setState({activeRound: activeRound - 1})} disabled={!canGoLeft}>
                  <KeyboardArrowLeft />
                  Zurück
                </Button>
              }
            />
          </Grid>
          <Grid item>
            <Button variant="contained" fullWidth color="primary" onClick={this.roundAddHandler}>
              Runde hinzufügen
            </Button>
          </Grid>
        </Grid>
        {/*<form action="/" method="POST" noValidate autoComplete="off" onSubmit={this.onSubmit}>*/}
        {/*  <TextField*/}
        {/*    id="date"*/}
        {/*    label="Datum"*/}
        {/*    type="datetime-local"*/}
        {/*    value={this.state.date}*/}
        {/*    onChange={this.onDateChange}*/}
        {/*  />*/}
        {/*  <div>*/}
        {/*    {questions.map((round, i) => (*/}
        {/*      <div key={`round-${i}`}>*/}
        {/*        {round.map((question, j) => (*/}
        {/*          <Question*/}
        {/*            key={`question-${j}`}*/}
        {/*            question={question}*/}
        {/*            stateValues={inputState}*/}
        {/*            onChangeHandler={this.onChange}*/}
        {/*          />*/}
        {/*        ))}*/}
        {/*        <a href="#" onClick={(event) => this.addQuestionInRound(event, i + 1)}>Frage in Runde hinzufügen*/}
        {/*          hinzufügen</a>*/}
        {/*      </div>*/}
        {/*    ))}*/}
        {/*  </div>*/}
        {/*  <div>*/}
        {/*    <a href="#" onClick={this.addRound}>Runde hinzufügen</a>*/}
        {/*  </div>*/}
        {/*  <div>*/}
        {/*    <Button type="submit" variant="contained">Abschicken</Button>*/}
        {/*  </div>*/}
        {/*  {successMessage ? <div>{successMessage}</div> : null}*/}
        {/*</form>*/}
      </form>
    );
  }
}

// function Question(props) {
//   let {question, stateValues, onChangeHandler} = props;
//   let {round, positionInround} = question;
//   let idPrefix = `${round}-${positionInround}`;
//
//   let roundId = `${idPrefix}-round`;
//   let positionInRoundId = `${idPrefix}-positionInRound`;
//   let questionId = `${idPrefix}-question`;
//   let questionExternalLinkId = `${idPrefix}-questionExternalLink`;
//   let correctAnswerId = `${idPrefix}-correctAnswer`;
//
//   return (
//     <div>
//       <TextField
//         fullWidth
//         required
//         type="number"
//         id={roundId}
//         label="Runde"
//         defaultValue={round}
//         disabled
//       />
//       <TextField
//         fullWidth
//         required
//         type="number"
//         id={positionInRoundId}
//         label="Position in Runde"
//         defaultValue={positionInround}
//         disabled
//       />
//       <TextField
//         fullWidth
//         required
//         id={questionId}
//         label="Frage"
//         value={getStateValue(stateValues, questionId)}
//         onChange={onChangeHandler}
//       />
//       <TextField
//         fullWidth
//         id={questionExternalLinkId}
//         label="Externer Link"
//         value={getStateValue(stateValues, questionExternalLinkId)}
//         onChange={onChangeHandler}
//       />
//       <TextField
//         fullWidth
//         id={correctAnswerId}
//         label="Korrekte Antwort"
//         value={getStateValue(stateValues, correctAnswerId)}
//         onChange={onChangeHandler}
//       />
//     </div>
//   );
// }

function getStateValue(stateValues, id) {
  if (stateValues[id] === undefined) {
    return '';
  } else {
    return stateValues[id];
  }
}

export default withStyles(quizMasterStyles)(withRouter(QuizMaster));
