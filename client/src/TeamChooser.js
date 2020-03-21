import {
  Box,
  Button,
  FormControlLabel,
  Link,
  Switch,
  TextField,
  Typography
} from "@material-ui/core";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

const TeamChooser = props => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="center"
    >
      <form>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h4">TODO: Hier Pubname</Typography>
          <TextField placeholder="Name deines Teams" />
          <FormControlLabel
            control={<Switch />}
            label="Team für andere Öffnen"
          />
          <Button variant="contained" color="primary" type="submit">
            Team starten
          </Button>
        </Box>
      </form>

      <Typography>
        <Link component={RouterLink} to="/groups">
          Alleine hier? Schließe dich einem anderen Team an!
        </Link>
      </Typography>
    </Box>
  );
};

export default TeamChooser;
