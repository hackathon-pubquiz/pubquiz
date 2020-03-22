import React from "react";
import { withStyles } from "@material-ui/core";

const styles = theme => ({
  pictureQuestion: {
    height: "100%"
  }
});

function PictureQuestion(props) {
  const { question, classes } = props;
  return (
    <img className={classes.pictureQuestion} src={question.questionExternalLink}/>
  );
}

export default withStyles(styles)(PictureQuestion);
