import React from "react";
import TextField from "@material-ui/core/TextField";

function TextQuestion() {
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

export default TextQuestion;
