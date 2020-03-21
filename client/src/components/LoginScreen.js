import pubquizBackground from "../img/pubquiz_background.png";
import { ReactComponent as BeerIcon } from "../img/bier.svg";
import { withStyles, TextField, Button, Grid, Switch, FormGroup, FormControlLabel } from "@material-ui/core";
import React, { useState } from "react";
import { login } from "../api";
import { useDispatch } from "react-redux";
import { requestGroupCreation } from "../redux/createGroup";

const styles = theme => ({
  header: {
    color: theme.palette.text.primary,
    background: "url(" + pubquizBackground + ")",
    backgroundSize: "cover",
    paddingTop: "1em",
    textAlign: "center",
    paddingBottom: "calc(20%)",
    "& h1, & h2, & h3, & h4, & h5, & h6": {
      margin: "1em",
      "&:first-child": {
        marginTop: 0
      },
      "&:last-child": {
        marginBottom: 0
      }
    }
  },
  headerContainer: {
    width: "100%"
  },
  headline: {
    fontFamily: "modernia",
    fontSize: "3em"
  },
  wedge: {
    position: "relative",
    paddingTop: "10%",
    marginTop: "-10%",
    background: theme.palette.background.default,
    "&:before": {
      background: "inherit",
      bottom: 0,
      content: '""',
      display: "block",
      height: "100%",
      left: 0,
      position: "absolute",
      right: 0,
      transform: "skewY(-5deg)",
      transformOrigin: 0
    }
  },
  footer: {
    marginBottom: "1em"
  },
  footerWrapper: {
    flexGrow: 1
  },
  main: {
    height: "100%"
  },
  beerIcon: {
    width: "9em",
    paddingLeft: "1.4em",
    fill: "white",
    marginTop: "1em"
  },
  goButton: {
    marginTop: "1em"
  }
});

function LoginScreen(props) {
  const [public_, setPublic] = useState(false);
  const [groupName, setGroupName] = useState("");
  const dispatch = useDispatch();

  const handlePublicSwitch = event => {
    setPublic(event.target.checked);
  };

  const { classes } = props;
  return (
    <Grid container direction="column" alignItems="center" className={classes.main}>
      <Grid item className={classes.headerContainer}>
        <header className={classes.header}>
          {/*<h1>Beer</h1>*/}
          <BeerIcon className={classes.beerIcon} />
          <h1 className={classes.headline}>Pub Quiz</h1>
          <h3>The Snug Kaiserslautern</h3>
        </header>
        <div className={classes.wedge} />
      </Grid>
      <Grid item>
        <TextField label="Name deines Teams" onChange={e => setGroupName(e.target.value)} value={groupName} />
      </Grid>
      <Grid item>
        <FormGroup row>
          <FormControlLabel
            control={<Switch checked={public_} onChange={handlePublicSwitch} name="public" />}
            label="Team für andere öffnen"
          />
        </FormGroup>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          className={classes.goButton}
          onClick={() => dispatch(requestGroupCreation(groupName, public_))}
        >
          LOS GEHT'S!
        </Button>
      </Grid>
      <Grid item container direction="column" justify="flex-end" className={classes.footerWrapper} alignItems="center">
        <Grid item component="footer" className={classes.footer}>
          <a>Alleine hier? Schließe dich einem anderen Team an!</a>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default withStyles(styles)(LoginScreen);
