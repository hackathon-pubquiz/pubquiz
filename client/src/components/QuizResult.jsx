import React, {useEffect, useState} from "react";
import {List, ListItem, Typography, withStyles, Grid} from "@material-ui/core";


const pointStyles = theme => ({
  container: {
    textAlign: "center",
  },
  star: {
    background: "gold",
    width: "60px",
    height: "60px",
    position: "relative",
    color: "black",
    margin: "20px",
    display: "flex",
    flexDirection: "column",
    flexWrap: "nowrap",
    justifyContent: "center",
    "&:before, &:after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      height: "60px",
      width: "60px",
      background: "gold",
      zIndex: -1,
    },
    "&:before": {
      transform: "rotate(30deg)",
    },
    "&:after": {
      transform: "rotate(60deg)",
    },
  },
  number: {
    fontSize: "2.5em",
    marginBottom: "-.3em",
    marginTop: "-.3em",
  },
});

const Points = withStyles(pointStyles)(props => {
  const { classes, star, points } = props;

  // TODO: i18n
  return (
    <div className={`${classes.container} ${star ? classes.star : ''}`}>
      <div className={classes.number}>
        {points}
      </div>
      <div className={classes.label}>
        Punkte
      </div>
    </div>
  );
});


const podiumStyles = theme => ({
  main: {
    "& $place": {
      background: theme.palette.primary.light,
    },
    "& > :first-child $place": {
      // second place
      height: "5.5em",
    },
    "& > :nth-child(2) $place": {
      // first place
      height: "8em",
    },
    "& > :nth-child(3) $place": {
      // second place
      height: "4em",
    },
  },
  name: {
    textAlign: "center",
  },
  place: {
    textAlign: "center",
    width: "100%",
    "& > div": {
      background: theme.palette.primary.main,
      borderRadius: "50%",
      width: "2.3em",
      height: "2.3em",
      lineHeight: "2.3em",
      fontWeight: "bold",
      verticalAlign: "center",
      margin: "auto",
      marginTop: ".3em"
    },
  },
});

const Podium = withStyles(podiumStyles)(props => {
  const { results, classes } = props;

  const PodiumPart = ({ points, name, place }) => {
    return (
      <Grid container item direction="column" wrap="nowrap" alignItems="center" justify="flex-end">
        <Grid item>
          {
            points != null
            ? <Points star points={points} />
            : ''
          }
        </Grid>
        <Grid item className={classes.name}>
          <Typography variant="h6">
            {name}
          </Typography>
        </Grid>
        <Grid item className={classes.place}>
          <div>
            {place}
          </div>
        </Grid>
      </Grid>
    );
  };

  let lastPlace = 0;
  console.log(results);
  let top3 = results.slice(0, 3);
  while (top3.length < 3) {
    top3.push(null);
  }
  console.log(top3);
  const podiumParts = top3.map(result => {
    console.log(result);
    let props = {name: "", points: null, place: ++lastPlace};
    if (result) {
      const { total_points, place, groupId } = result;
      props = {name: `Gruppe ${groupId}`, points: total_points , place}; // TODO: get real group names
      lastPlace = result.place;
    }
    console.log(props);
    return (<PodiumPart {...props} />);
  });

  return (
    <Grid container wrap="nowrap" className={classes.main}>
      {podiumParts}
    </Grid>
  );
});


const QuizResult = props => {
  const { quizId } = props;

  const [isLoaded, setIsLoaded] = useState(false);
  const [pointsPerGroup, setPoints] = useState([]);
  const [error, setError] = useState(null);

  const preprocessResults = (results, inplace) => {
    if (inplace == null) inplace = true;
    if (!inplace) results = [...results];
    results.sort((r1, r2) => r2.total_points - r1.total_points);

    let lastScore = null;
    let lastPlace = 0;

    for (let idx in results) {
      const res = results[idx];
      if (lastScore == null || lastScore > res.total_points) {
        lastScore = res.total_points;
        lastPlace++;
      }
      if (!inplace) {
        results[idx] = {place: lastPlace, ...res};
      } else {
        res.place = lastPlace;
      }
    }

    return results;
  };

  useEffect(() => {
    fetch(`/api/quiz/${quizId}/points`)
      .then(res => res.json())
      .then(
        result => {
          preprocessResults(result);
          console.log(result);
          setPoints(result);
          setIsLoaded(true);
        },
        error => {
          setIsLoaded(true);
          setError(error);
        }
      );
    // setPoints(preprocessResults([
    //   {groupId: 1, total_points: 10},
    //   {groupId: 3, total_points:  5},
    //   {groupId: 2, total_points: 15},
    //   {groupId: 9, total_points: 25},
    // ]));
    // setIsLoaded(true);
  }, [quizId]);

  if (!isLoaded) return <Typography>Laden...</Typography>;
  else if (error) return <Typography color="error">Error: {error}</Typography>;
  else {
    // TODO: make list view nice: expand vertically, auto overflow, style items
    const resultPerGroup = pointsPerGroup.slice(3).map(ppg => (
      <ListItem key={ppg.groupId}>
        <Typography>
          GroupId: {ppg.groupId},Punkte: {ppg.total_points}
        </Typography>
        <Points points={ppg.total_points} />
      </ListItem>
    ));
    return (
      <>
        <Typography variant="h4">Ergebnisse</Typography>
        <Podium results={pointsPerGroup} />
        <List>{resultPerGroup}</List>
      </>
    );
  }
};

export default QuizResult;