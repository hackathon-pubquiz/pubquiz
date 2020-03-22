import React, { useEffect, useState } from "react";
import { Typography, Button } from "@material-ui/core";
import { useParams } from "react-router-dom";

const HostQuiz = props => {
  const { socket } = props;
  const [error, setError] = useState(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [quiz, setQuiz] = useState(null);

  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const [questions, setQuestions] = useState([]);

  const [round, setRound] = useState(null);

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
        },
        error => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [id]);

  const questionItems = questions.map(question => (
    <Typography key={question.id}>
      Frage: {question.question}| Antwort:{question.correctAnswer}
    </Typography>
  ));

  const startQuiz = () => {
    console.log("starting quiz", quiz.id);
    socket.emit("start_quiz", quiz.id)
    setRound(1);
  }

  if (!isLoaded || !questionsLoaded) {
    return <Typography>Lade...</Typography>;
  } else if (error) {
    return <Typography>Error while loading quiz: {error}</Typography>;
  } else if (null === quiz) {
    return <Typography>Quiz not found</Typography>;
  } else if (!round) {
    return (
      <div>
        <Typography variant="h4">Quiz {quiz.date}</Typography>
        {questionItems}
        <Button variant="contained" color="primary" onClick={startQuiz}>
          Start!
        </Button>
      </div>
    );
  } else {
    return <HostQuizRound round={round} roundTime={60} />
  }
};

const HostQuizRound = (props) => {
  const { round, roundTime } = props;
  const [counter, setCounter] = React.useState(roundTime);

  React.useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);

  return <div>
    <div>Zeit übrig: {counter}</div>
    <div>{round}</div>
  </div>;
}

export default HostQuiz;
export { HostQuizRound };
