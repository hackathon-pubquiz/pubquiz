import React, { useState, useEffect } from "react";
import { Box, Fab, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useSelector } from "react-redux";
import {useParams} from "react-router-dom";

const joinGroup = async (groupId, userId) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      groupId: groupId,
      userId: userId
    })
  };

  await fetch("/api/group/join", requestOptions).then(() => {
    // TODO: weiterleiten zum Gruppenchat/oder so?
  });
};

const Groups = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [groups, setGroups] = useState([]);
  const {pubId} = useParams();

  const userId = useSelector(state => state.session.user.id);

  useEffect(() => {
    fetch("/api/groups/" + pubId)
      .then(res => res.json())
      .then(
        result => {
          setIsLoaded(true);
          setGroups(result);
        },
        error => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [pubId]);

  const groupItems = groups.map(group => {
    const joinButton = group.public ? (
      <Fab color="primary" onClick={() => joinGroup(group.id, userId)}>
        <AddIcon />
      </Fab>
    ) : null;
    return (
      <Box display="flex" justifyContent="space-between" alignItems="center" key={group.id} m={2}>
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
};

export default Groups;
