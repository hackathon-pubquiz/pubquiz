import React from "react";
import {withStyles, Grid, Paper} from "@material-ui/core";
import pubquizBackground from "../img/pubquiz_background.png";
import { ReactComponent as BeerIcon } from "../img/bier.svg";

const stylesFull = theme => ({
  header: {
    color: theme.palette.text.primary,
    background: "url(" + pubquizBackground + ")",
    backgroundSize: "cover",
    paddingTop: "1em",
    textAlign: "center",
    paddingBottom: "calc(20%)",
    "& h1, & h2, & h3, & h4, & h5, & h6": {
      margin: "1em",
      "&:first-child": {
        marginTop: 0,
      },
      "&:last-child": {
        marginBottom: 0,
      },
    },
  },
  headerContainer: {
    width: "100%",
  },
  beerIcon: {
    width: "9em",
    paddingLeft: "1.4em",
    fill: "white",
    marginTop: "1em",
  },
  headline: {
    fontFamily: "modernia",
    fontSize: "3em",
  },
  wedge: {
    position: "relative",
    paddingTop: "10%",
    marginTop: "-10%",
    background: theme.palette.background.default,
    "&:before": {
      background: "inherit",
      bottom: 0,
      content: '""',
      display: "block",
      height: "100%",
      left: 0,
      position: "absolute",
      right: 0,
      transform: "skewY(-5deg)",
      transformOrigin: 0,
    },
  },
});

const HeaderFull = withStyles(stylesFull)(props => {
  const { classes, pubName } = props;

  return (
    <>
      <header className={classes.header}>
        <BeerIcon className={classes.beerIcon} />
        <h1 className={classes.headline}>Pub Quiz</h1>
        <h3>{pubName}</h3>
      </header>
      <div className={classes.wedge} />
    </>
  );
});

const stylesCompact = theme => ({
  header: {
    color: theme.palette.text.primary,
    background: "url(" + pubquizBackground + ")",
    backgroundSize: "cover",
    backgroundPosition: "center",
    "& h1, & h2, & h3, & h4, & h5, & h6": {
      margin: "0rem 1rem",
      marginRight: 0,
      "&:first-child": {
        marginTop: 0,
      },
      "&:last-child": {
        marginBottom: 0,
      },
    },
    padding: "1rem .5rem",
    "&:not(.no-margin)": {
      marginBottom: "1rem",
    },
  },
  beerIcon: {
    width: "5em",
    paddingRight: "0.4em",
    fill: "white",
  },
  headline: {
    fontFamily: "modernia",
    fontSize: "2.4em",
  },
});


const HeaderCompact = withStyles(stylesCompact)(props => {
  const { classes, pubName, noMargin, children } = props;

  const headerClasses = `${classes.header} ${noMargin ? 'no-margin' : ''}`;

  let Headline = (<></>);
  if (children) {
    Headline = (
      <Paper variant="outlined" square>
        {children}
      </Paper>
    )
  }

  return (
    <>
      <Grid container component="header" className={headerClasses} alignItems="center" wrap="nowrap">
        <Grid item>
          <BeerIcon className={classes.beerIcon} />
        </Grid>
        <Grid item>
          <h1 className={classes.headline}>Pub Quiz</h1>
          <h3>{pubName}</h3>
        </Grid>
      </Grid>
      {Headline}
    </>
  );
});

function Header(props) {
  const {compact, ...newProps} = props;
  if (compact) return (<HeaderCompact {...newProps} />);
  else return (<HeaderFull {...newProps}/>)
}

export default Header;