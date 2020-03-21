import React, { useEffect, useState } from "react";
import { Link, Typography } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

const QuizOperation = () => {
  return (
    <Typography>
      <Typography variant="h3">QuizOperation</Typography>
      <div>Übersicht Teams? (Um zum Beispiel 2 1er Teams zusammenzusetzen)</div>
      <div>Quiz starten? </div>
      <div>Timer</div>
      <div>Runde bewerten</div>
    </Typography>
  );
};

const HostQuizzes = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetch("/api/quizzes")
      .then(res => res.json())
      .then(
        result => {
          setIsLoaded(true);
          setQuizzes(result);
        },
        error => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  const quizItems = quizzes.map(quiz => (
    <Typography key={quiz.id}>
      <Link component={RouterLink} to={"/host/quiz/" + quiz.id}>
        Quiz: {quiz.date}
      </Link>{" "}
    </Typography>
  ));

  if (!isLoaded) {
    return <Typography>Lade...</Typography>;
  } else if (error) {
    return <Typography>Error while loading quizzes: {error}</Typography>;
  } else {
    return (
      <div>
        <Typography variant="h4">Quizzes</Typography>
        {quizItems}
      </div>
    );
  }
};

export default HostQuizzes;
