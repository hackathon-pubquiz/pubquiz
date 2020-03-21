import pubquizBackground from "../img/pubquiz_background.png";
import { ReactComponent as BeerIcon } from "../img/bier.svg";
import { withStyles, TextField, Button, Grid, Switch, FormGroup, FormControlLabel } from "@material-ui/core";
import React, { useState } from "react";
import Header from "./Header";
import { login } from "../api";
import { useDispatch } from "react-redux";
import { requestGroupCreation } from "../redux/createGroup";

const styles = theme => ({
  footer: {
    marginBottom: "1em"
  },
  footerWrapper: {
    flexGrow: 1
  },
  main: {
    height: "100%"
  },
  goButton: {
    marginTop: "1em"
  }
});

function RegisterTeamScreen(props) {
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
        <Header />
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

export default withStyles(styles)(RegisterTeamScreen);
