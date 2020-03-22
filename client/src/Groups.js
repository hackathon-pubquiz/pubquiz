import React, {useState, useEffect} from "react";
import {joinGroup} from "./api";
import {Box, Fab, Typography} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import { useTranslation } from "react-i18next";

const Groups = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [groups, setGroups] = useState([]);
  const {pubId} = useParams();
  const { t } = useTranslation();

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
        <AddIcon/>
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
        {t('joinTeam')}
        {groupItems}
      </Typography>
    );
};

export default Groups;
