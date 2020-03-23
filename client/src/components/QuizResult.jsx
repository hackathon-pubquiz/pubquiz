import React, {useEffect, useState} from "react";
import {List, ListItem, Typography, withStyles, Grid} from "@material-ui/core";
import { withTranslation } from 'react-i18next';


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
  label: {
    fontSize: "80%",
    fontWeight: "bold",
  },
});

const Points = withTranslation()(withStyles(pointStyles)(props => {
  const { classes, star, points, t } = props;

  return (
    <div className={`${classes.container} ${star ? classes.star : ''}`}>
      <div className={classes.number}>
        {points}
      </div>
      <div className={classes.label}>
        {t('points')}
      </div>
    </div>
  );
}));


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
  names: {
    textAlign: "center",
    "& > *": {
      lineHeight: "1.1em",
    },
    "& > :not(:last-child)": {
      marginBottom: "0.5em",
    },
    "& > :last-child": {
      marginBottom: "0.2em",
    },
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

  const PodiumPart = ({ points, names, place }) => {
    return (
      <Grid container item direction="column" wrap="nowrap" alignItems="center" justify="flex-end">
        <Grid item>
          {
            points != null
            ? <Points star points={points} />
            : ''
          }
        </Grid>
        <Grid item className={classes.names}>
          {names.map((name, idx) =>
            <Typography key={idx} variant="h6">
              {name}
            </Typography>
          )}
        </Grid>
        <Grid item className={classes.place}>
          <div>
            {place}
          </div>
        </Grid>
      </Grid>
    );
  };

  let top3 = results.filter(res => (res.place <= 3));
  let groupsByPlace = {1: [], 2: [], 3:[]};
  for (let groupRes of top3) {
    groupsByPlace[groupRes.place].push(groupRes);
  }
  for (let place in groupsByPlace) {
    if (!groupsByPlace[place].length) {
      groupsByPlace[place].push({name: "", points: null, place: top3.length + 1});
    }
  }

  return (
    <Grid container wrap="nowrap" className={classes.main}>
      <PodiumPart names={groupsByPlace[2].map(g => g.name)} place={2} points={groupsByPlace[2][0].points} />
      <PodiumPart names={groupsByPlace[1].map(g => g.name)} place={1} points={groupsByPlace[1][0].points} />
      <PodiumPart names={groupsByPlace[3].map(g => g.name)} place={3} points={groupsByPlace[3][0].points} />
    </Grid>
  );
});


const InlineResult = props => {
  const { name, points, place } = props;

  return (
    <Grid container alignItems="center" wrap="nowrap" spacing={2}>
      <Grid item>
        <Typography variant="h6" display="inline">
          {place}.
        </Typography>
      </Grid>
      <Grid item xs>
        <Typography variant="h6" display="inline">
          {name}
        </Typography>
      </Grid>
      <Grid item>
        <Points points={points}/>
      </Grid>
    </Grid>
  );
};


const resultStyles = theme => ({
  main: {
    maxWidth: "400px",
    margin: "auto",
  },
});


const QuizResult = withStyles(resultStyles)(props => {
  const { quizId, classes } = props;

  const [namesLoaded, setNamesLoaded] = useState(false);
  const [pointsLoaded, setPointsLoaded] = useState(false);
  const [pointsPerGroup, setPoints] = useState([]);
  const [processedResults, setProcessedResults] = useState(null);
  const [groupNames, setGroupNames] = useState({});
  const [error, setError] = useState(null);

  const preprocessResults = (results, inplace) => {
    if (inplace == null) inplace = true;
    if (!inplace) results = [...results];
    results.sort((r1, r2) => r2.total_points - r1.total_points);

    let lastScore = null;
    let lastPlace = 0;

    for (let idx in results) {
      const res = inplace ? results[idx] : {...results[idx]};
      if (lastScore == null || lastScore > res.total_points) {
        lastScore = res.total_points;
        lastPlace++;
      }
      res.place = lastPlace;
      res.points = res.total_points;
      delete res.total_points;
      res.name = groupNames[res.groupId];
    }

    return results;
  };

  useEffect(() => {
    if (!(namesLoaded && pointsLoaded)) return;
    setProcessedResults(preprocessResults(pointsPerGroup));
  }, [namesLoaded, pointsLoaded]);

  useEffect(() => {
    setProcessedResults(null);
    setNamesLoaded(false);
    setPointsLoaded(false);
    fetch(`/api/quiz/${quizId}/points`)
      .then(res => res.json())
      .then(
        result => {
          console.log('api points res', result);
          setPoints(result);
          setPointsLoaded(true);
        },
        error => {
          setPointsLoaded(true);
          setError(error);
        }
      );
    fetch(`/api/groups/`)
      .then(res => res.json())
      .then(
        result => {
          let groupNames_ = {};
          for (let group of result) groupNames_[group.id] = group.name;
          setGroupNames(groupNames_);
          console.log('api groups res', result);
          setNamesLoaded(true);
        },
        error => {
          setNamesLoaded(true);
          setError(error);
        }
      );
    // setPoints(preprocessResults([
    //   {groupId: 1, total_points: 10},
    //   {groupId: 3, total_points:  5},
    //   {groupId: 2, total_points: 15},
    //   {groupId: 4, total_points: 15},
    //   {groupId: 9, total_points: 25},
    // ]));
    // setNamesLoaded(true);
    // setPointsLoaded(true);
  }, [quizId]);

  if (error) return <Typography color="error">Error: {error}</Typography>;
  else if (processedResults == null) return <Typography>Laden...</Typography>;
  else {
    return (
      <>
        <Typography variant="h4">Ergebnisse</Typography>
        <div className={classes.main}>
          <Podium results={processedResults} />
          <List>
            {processedResults.filter(result => (result.place > 3)).map(result =>
              <ListItem disableGutters>
                <InlineResult name={result.name} points={result.points} place={result.place} />
              </ListItem>
            )}
          </List>
        </div>
      </>
    );
  }
});

export default QuizResult;