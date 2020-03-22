import React from "react";
import TextField from "@material-ui/core/TextField";

function AnswerTextField() {
  return (
      <TextField
        label="Anwort"
        style={{ margin: 8, width: "80%" }}
        helperText="Hannes tippt gerade..."
        margin="normal"
        variant="outlined"
      />
  );
}

export default AnswerTextField;
