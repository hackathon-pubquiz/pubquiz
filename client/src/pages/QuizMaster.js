import React from "react";
import { withRouter } from "react-router";
import { withStyles } from "@material-ui/core/styles";
import { TextField, Button } from "@material-ui/core";

const styles = theme => ({
  root: {}
});

class QuizMaster extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: [],
      maxInround: [],
      successMessage: null,
      inputState: {}
    };
  }

  componentDidMount() {
    let id = this.props.match.params.pubId;
    let date = this.props.match.params.quizDate;
  }

  onChange = (event, newValue) => {
    event.persist();

    let { inputState } = this.state;
    inputState[event.target.id] = event.target.value;

    this.setState({ inputState });
  };

  addRound = event => {
    event.preventDefault();
    let { questions, maxInround } = this.state;

    let round = questions.length + 1;
    maxInround[round] = 1;
    questions = [...questions, [{ round: round, positionInround: 1 }]];

    this.setState({ questions, maxInround });
  };

  addQuestionInRound = (event, round) => {
    event.preventDefault();

    let { questions, maxInround } = this.state;
    let questionsInRound = questions[round - 1];

    maxInround[round] += 1;
    questionsInRound = [...questionsInRound, { round: round, positionInround: maxInround[round] }];
    questions[round - 1] = questionsInRound;

    this.setState({ questions, maxInround });
  };

  onSubmit = event => {
    event.preventDefault();

    let questions = this.collectDataToSubmit();

    fetch("/api/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(questions)
    })
      .then(data => {
        this.setState({ successMessage: "Daten wurde erfolgreich gepspeichert" });
      })
      .catch(error => {
        console.error("Error:", error);
      });
  };

  collectDataToSubmit = () => {
    let { inputState } = this.state;

    let questions = [];

    for (let field in inputState) {
      let value = inputState[field];
      let [questionId, positionInroundId, fieldName] = field.split("-");

      let question = questions.find(e => {
        return e.id === questionId && e.positionInround === positionInroundId;
      });

      if (question == null) {
        question = { id: questionId, positionInround: positionInroundId };
        questions = [...questions, question];
      }

      question[fieldName] = value;
    }

    return questions;
  };

  render() {
    let { questions, successMessage } = this.state;

    return (
      <div>
        <form action="/" method="POST" noValidate autoComplete="off" onSubmit={this.onSubmit}>
          <div>
            {questions.map((round, i) => (
              <div key={`round-${i}`}>
                {round.map((question, j) => (
                  <Question
                    key={`question-${j}`}
                    question={question}
                    stateValues={this.state.inputState}
                    onChangeHandler={this.onChange}
                  />
                ))}
                <a href="#" onClick={event => this.addQuestionInRound(event, i + 1)}>
                  Frage in Runde hinzufügen hinzufügen
                </a>
              </div>
            ))}
          </div>
          <div>
            <a href="#" onClick={this.addRound}>
              Runde hinzufügen
            </a>
          </div>
          <div>
            <Button type="submit" variant="contained">
              Abschicken
            </Button>
          </div>
          {successMessage ? <div>{successMessage}</div> : null}
        </form>
      </div>
    );
  }
}

function Question(props) {
  let { question, stateValues, onChangeHandler } = props;
  let { round, positionInround } = question;
  let idPrefix = `${round}-${positionInround}`;

  let roundId = `${idPrefix}-round`;
  let positionInRoundId = `${idPrefix}-positionInRound`;
  let questionId = `${idPrefix}-question`;
  let questionExternalLinkId = `${idPrefix}-questionExternalLink`;
  let correctAnswerId = `${idPrefix}-correctAnswer`;

  return (
    <div>
      <TextField
        fullWidth
        required
        type="number"
        id={roundId}
        label="Runde"
        defaultValue={round}
        disabled
      />
      <TextField
        fullWidth
        required
        type="number"
        id={positionInRoundId}
        label="Position in Runde"
        defaultValue={positionInround}
        disabled
      />
      <TextField
        fullWidth
        required
        id={questionId}
        label="Frage"
        value={getStateValue(stateValues, questionId)}
        onChange={onChangeHandler}
      />
      <TextField
        fullWidth
        id={questionExternalLinkId}
        label="Externer Link"
        value={getStateValue(stateValues, questionExternalLinkId)}
        onChange={onChangeHandler}
      />
      <TextField
        fullWidth
        id={correctAnswerId}
        label="Korrekte Antwort"
        value={getStateValue(stateValues, correctAnswerId)}
        onChange={onChangeHandler}
      />
    </div>
  );
}

function getStateValue(stateValues, id) {
  if (stateValues[id] === undefined) {
    return "";
  } else {
    return stateValues[id];
  }
}

export default withStyles(styles)(withRouter(QuizMaster));
