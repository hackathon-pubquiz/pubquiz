import React, { useEffect, useState } from "react";
import { Typography, Button, List, ListItem, Box, TextField } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { CopyToClipboard } from 'react-copy-to-clipboard';

const HostQuiz = props => {
  const { socket } = props;
  const [error, setError] = useState(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [quiz, setQuiz] = useState(null);

  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const [questions, setQuestions] = useState([]);

  const [round, setRound] = useState(null);
  const [lastRound, setLastRound] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    fetch("/api/quiz/" + id)
      .then(res => res.json())
      .then(
        result => {
          setQuiz(result);
          setIsLoaded(true);
        },
        error => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [id]);

  useEffect(() => {
    fetch("/api/questions/" + id)
      .then(res => res.json())
      .then(
        result => {
          setQuestions(result);
          setQuestionsLoaded(true);
          setLastRound(Math.max(...result.map(question => question.round)));
        },
        error => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [id]);

  const questionItems = questions.map(question => (
    <Typography key={question.id}>
      Frage: {question.question || question.questionExternalLink} | Antwort:{question.correctAnswer} | Runde:
      {question.round}
    </Typography>
  ));

  const roundQuestions = questions.filter(q => q.round === round);

  const startQuiz = () => {
    console.log("starting quiz", quiz.id);
    socket.emit("start_quiz", quiz.id);
    setRound(1);
  };

  const finishRound = () => {
    console.log("Bewertung abgeschlossen", round);
    setRound(round + 1);
  };

  const startRound = () => {
    console.log("Runde gestartet", quiz.id, round);
    socket.emit("round_started", quiz.id, round);
  };

  const timesUp = () => {
    console.log("Rundenzeit abgelaufen", quiz.id, round);
    socket.emit("round_finished", quiz.id, round);
  };

  const copy = require('clipboard-copy')


  if (!isLoaded || !questionsLoaded) {
    return <Typography>Lade...</Typography>;
  } else if (error) {
    return <Typography>Error while loading quiz: {error}</Typography>;
  } else if (null === quiz) {
    return <Typography>Quiz not found</Typography>;
  } else if (!round) {
    return (
      <div>
        <Typography variant="h4">
          Quiz {quiz.date}({lastRound} Runden)
        </Typography>
        {questionItems}
        <CopyToClipboard text="http://localhost:3000/login/1">
          <Button variant="contained" color="primary">
          Einladungslink in Zwischenablage kopieren!
          </Button>
        </CopyToClipboard>
        <Button variant="contained" color="primary" onClick={startQuiz}>
          Start!
        </Button>
      </div>
    );
  } else if (round <= lastRound) {
    return (
      <HostQuizRound
        quizId={quiz.id}
        round={round}
        roundTime={1}
        finishRound={finishRound}
        timesUp={timesUp}
        startRound={startRound}
        questions={roundQuestions}
      />
    );
  } else {
    return <HostQuizResults quizId={quiz.id} />;
  }
};

const HostQuizResults = props => {
  const { quizId } = props;

  const [isLoaded, setIsLoaded] = useState(false);
  const [pointsPerGroup, setPoints] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/quiz/${quizId}/points`)
      .then(res => res.json())
      .then(
        result => {
          console.log(result);
          setPoints(result);
          setIsLoaded(true);
        },
        error => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [quizId]);

  if (!isLoaded) return <Typography>Laden...</Typography>;
  else if (error) return <Typography>Error: {error}</Typography>;
  else {
    const resultPerGroup = pointsPerGroup.map(ppg => (
      <ListItem key={ppg.groupId}>
        <Typography>
          GroupId: {ppg.groupId},Punkte: {ppg.total_points}
        </Typography>
      </ListItem>
    ));
    return (
      <>
        <Typography variant="h4">Ergebnisse</Typography>
        <List>{resultPerGroup}</List>
      </>
    );
  }
};

const HostQuizRound = props => {
  const { round, quizId, roundTime, finishRound, timesUp, startRound, questions } = props;
  const [counter, setCounter] = useState(roundTime);
  const [roundStarted, setRoundStarted] = useState(false);

  const resetState = () => {
    setCounter(roundTime);
    setRoundStarted(false);
  };

  useEffect(() => {
    resetState();
  }, [round]);

  useEffect(() => {
    if (roundStarted) {
      if (counter > 0) {
        setTimeout(() => setCounter(counter - 1), 1000);
      } else {
        timesUp();
      }
    }
  }, [counter, roundStarted]);

  const startTimer = () => {
    setRoundStarted(true);
    setCounter(roundTime);
    startRound();
  };

  if (counter == 0) {
    return <HostQuestionEvaluation quizId={quizId} round={round} finishRound={finishRound}></HostQuestionEvaluation>;
  } else {
    const questionItems = questions.map(q => <Typography key={q.id}>{q.question}</Typography>);
    return (
      <>
        <Typography variant="h4">Runde {round}</Typography>
        <Typography>Zeit übrig: {counter}</Typography>
        <div>Fragen:{questionItems}</div>
        <Button variant="contained" color="primary" onClick={startTimer} disabled={roundStarted}>
          Runde starten
        </Button>
      </>
    );
  }
};

const HostQuestionEvaluation = props => {
  const { finishRound, quizId, round } = props;
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/question_submissions/${quizId}/${round}`)
      .then(res => res.json())
      .then(
        result => {
          setAnswers(result);
          setIsLoaded(true);
        },
        error => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [quizId, round]);

  const [formData, setFormData] = useState({});
  const handleInputChange = event => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const sendEvaluationAndFinishRound = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    };
    const result = await fetch("/api/update_evaluations", requestOptions);
    console.log(result);

    finishRound();
  };

  if (!isLoaded) return <>Laden...</>;
  else if (error) return <>Error: {error}</>;
  else {
    const answerItems = answers.map(answer => (
      <QuestionSubmissions key={answer.id} handleChange={handleInputChange} questionWithSubmissions={answer} />
    ));
    return (
      <form>
        <Typography variant="h4">Runde {round}: Antworten der Teams</Typography>
        {answerItems}
        <Button variant="contained" color="primary" onClick={sendEvaluationAndFinishRound}>
          Bewertung abschließen
        </Button>
      </form>
    );
  }
};

const QuestionSubmissions = props => {
  const { handleChange, questionWithSubmissions } = props;
  const listItems = questionWithSubmissions.QuestionSubmissions.map(submission => (
    <ListItem key={submission.id}>
      <Box display="flex" justifyContent="space-between" alignItems="center" flexGrow={1}>
        <Typography>{submission.answer}</Typography>
        <TextField label="Punkte" type="number" name={submission.id.toString()} onChange={handleChange} />
      </Box>
    </ListItem>
  ));
  return (
    <>
      <Typography variant="h6">
        Frage: {questionWithSubmissions.question || questionWithSubmissions.questionExternalLink}
      </Typography>
      <Typography variant="h6">Korrekte Antwort: {questionWithSubmissions.correctAnswer}</Typography>
      <List>{listItems}</List>
    </>
  );
};

export default HostQuiz;
