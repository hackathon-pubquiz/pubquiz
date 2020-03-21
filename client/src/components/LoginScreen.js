import pubquizBackground from "../img/pubquiz_background.png";
import { withStyles, TextField } from "@material-ui/core";
import React from "react";

const styles = theme => ({
  header: {
    color: theme.palette.text.primary,
    background: "url(" + pubquizBackground + ")",
    backgroundSize: "cover",
  },
  flex: {
    flex: 1
  }
});

function LoginScreen(props) {
  const { classes } = props;
  return (
    <div className={classes.header}>
      <header className="LoginScreen-header">
        <h1>Beer</h1>
        <h1>Pub Quiz</h1>
        <h3>Pub Name</h3>
      </header>
      <form>
        <TextField
          id="standard-dense"
          label="Dense"
          margin="dense"
        />
        <input type="button" value="LOS GEHT'S!"/>
      </form>
      <footer>
        <a>Ich bin Pub-Besitzer</a>
      </footer>
    </div>
  );
}

export default withStyles(styles)(LoginScreen);