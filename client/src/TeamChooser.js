import React from "react";
import {
  Typography,
  TextField,
  Switch,
  Button,
  Box,
  FormControlLabel
} from "@material-ui/core";

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
        Alleine hier? Schließe dich einem anderen Team an! TODO: Link
      </Typography>
    </Box>
  );
};

export default TeamChooser;
