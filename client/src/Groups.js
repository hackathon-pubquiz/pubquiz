import React, { Component } from "react";
import { Box, Fab, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

class Groups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      groups: []
    };
  }

  componentDidMount() {
    fetch("/api/groups")
      .then(res => res.json())
      .then(
        result => {
          this.setState({ isLoaded: true, groups: result });
        },
        error => {
          this.setState({ isLoaded: true, error: error });
        }
      );
  }

  render() {
    const { error, isLoaded, groups } = this.state;

    const groupItems = groups.map(group => {
      const joinButton = group.public ? (
        <Fab color="primary">
          <AddIcon />
        </Fab>
      ) : null;
      return (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          key={group.id}
          m={2}
        >
          <Typography variant="h5">Team: "{group.name}"</Typography>
          {joinButton}
        </Box>
      );
    });

    if (error) return <div>Error: {error.message}</div>;
    else if (!isLoaded) return <div>Loading...</div>;
    else
      return (
        <Typography>
          Tritt einem der öffentlichen Teams bei!
          {groupItems}
        </Typography>
      );
  }
}

export default Groups;
