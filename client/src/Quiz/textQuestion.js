import React from "react";

export default function TextQuestion(props) {
  const { question } = props;
  return <p>{question.title}</p>;
}
