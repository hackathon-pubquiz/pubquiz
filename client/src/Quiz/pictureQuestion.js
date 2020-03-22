import React from "react";
import { withStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";

const styles = theme => ({
  pictureQuestion: {
    height: "100%"
  }
});

function PictureQuestion(props) {
  const { question, classes } = props;
  const { t } = useTranslation();
  
  return (
    <img className={classes.pictureQuestion} src={question.questionExternalLink} alt={t('altPictureText')}/>
  );
}

export default withStyles(styles)(PictureQuestion);
