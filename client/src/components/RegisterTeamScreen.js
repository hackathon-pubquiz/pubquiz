import { withStyles, TextField, Button, Grid, Switch, FormGroup, FormControlLabel } from "@material-ui/core";
import React, { useState } from "react";
import Header from "./Header";
import {useDispatch, useSelector} from "react-redux";
import { requestGroupCreation } from "../redux/groupApi";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
  }
});

function RegisterTeamScreen(props) {
  const [public_, setPublic] = useState(false);
  const [groupName, setGroupName] = useState("");
  const {pubId} = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const socketId = useSelector(state => state.socket.socketId);

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
        <TextField label={t("yourTeamName")} onChange={e => setGroupName(e.target.value)} value={groupName} />
      </Grid>
      <Grid item>
        <FormGroup row>
          <FormControlLabel
            control={<Switch checked={public_} onChange={handlePublicSwitch} name="public" />}
            label={t("makeTeamPublic")}
          />
        </FormGroup>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          className={classes.goButton}
          onClick={() => dispatch(requestGroupCreation(pubId, groupName, public_, socketId))}
        >
          {t("startTeam")}
        </Button>
      </Grid>
      <Grid item container direction="column" justify="flex-end" className={classes.footerWrapper} alignItems="center">
        <Grid item component="footer" className={classes.footer}>
          <a>{t("areYouAlone")}</a>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default withStyles(styles)(RegisterTeamScreen);
