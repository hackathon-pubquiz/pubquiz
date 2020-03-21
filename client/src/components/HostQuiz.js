import React, { useEffect, useState } from "react";
import { Typography } from "@material-ui/core";
import { useParams } from "react-router-dom";

const HostQuiz = props => {
  const [error, setError] = useState(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [quiz, setQuiz] = useState(null);

  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const [questions, setQuestions] = useState([]);

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
  }, []);

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
  }, []);

  const questionItems = questions.map(question => (
    <Typography key={question.id}>
      Frage: {question.question}| Antwort:{question.correctAnswer}
    </Typography>
  ));

  if (!isLoaded || !questionsLoaded) {
    return <Typography>Lade...</Typography>;
  } else if (error) {
    return <Typography>Error while loading quizzes: {error}</Typography>;
  } else {
    return (
      <div>
        <Typography variant="h4">Quiz {quiz.date}</Typography>
        {questionItems}
      </div>
    );
  }
};

export default HostQuiz;
