import { ReactComponent as BarrelIcon } from "../img/fass.svg";
import { withStyles, TextField, Button, Grid, Switch, FormGroup, FormControlLabel } from "@material-ui/core";
import React, {useEffect, useState} from "react";
import Header from "./Header";
import { login } from "../api";
import { useDispatch } from "react-redux";
import {requestLoginUser} from "../redux/sessions";
import {useParams} from "react-router-dom";

const styles = theme => ({
  footer: {
    marginBottom: "1em",
  },
  footerWrapper: {
    flexGrow: 1,
  },
  main: {
    height: "100%",
  },
  goButton: {
    marginTop: "1em",
  },
  barrelIcon: {
    fill: theme.palette.text.primary,
    height: "1.5em",
    width: "1.5em",
    paddingRight: "0.4em",
    boxSizing: "content-box",
    verticalAlign: "bottom",
  },
});

function RegisterTeamScreen(props) {
  const [nickname, setNickname] = useState("");
  const [pubName, setPubName] = useState("");
  const {pubId} = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    fetch("/api/pub/" + pubId)
      .then(res => res.json())
      .then(
        result => {
          setPubName(result.name);
        },
      );
  }, [pubId]);

  const handleLogin = () => {
    dispatch(requestLoginUser(pubId, nickname));
  };

  const { classes } = props;
  return (
    <Grid container direction="column" alignItems="center" className={classes.main}>
      <Grid item className={classes.headerContainer}>
        <Header pubName={pubName} />
      </Grid>
      <Grid item>
        <TextField label="Dein Name" onChange={e => setNickname(e.target.value)} value={nickname} />
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          className={classes.goButton}
          onClick={handleLogin}
        >
          LOS GEHT'S!
        </Button>
      </Grid>
      <Grid item container direction="column" justify="flex-end" className={classes.footerWrapper} alignItems="center">
        <Grid item component="footer" className={classes.footer}>
          <BarrelIcon className={classes.barrelIcon}/>
          <a>Ich bin Pub-Betreiber</a>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default withStyles(styles)(RegisterTeamScreen);
