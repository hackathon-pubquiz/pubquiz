import React from "react";
import { withStyles, Grid } from "@material-ui/core";
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
  const { classes } = props;

  return (
    <>
      <header className={classes.header}>
        <BeerIcon className={classes.beerIcon} />
        <h1 className={classes.headline}>Pub Quiz</h1>
        <h3>The Snug Kaiserslautern</h3>
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
    marginBottom: "1rem",
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
  const { classes } = props;

  return (
    <Grid container component="header" className={classes.header} alignItems="center" wrap="nowrap">
      <Grid item>
        <BeerIcon className={classes.beerIcon} />
      </Grid>
      <Grid item>
        <h1 className={classes.headline}>Pub Quiz</h1>
        <h3>The Snug Kaiserslautern</h3>
      </Grid>
    </Grid>
  );
});

function Header(props) {
  const {compact, ...newProps} = props;
  if (compact) return (<HeaderCompact {...newProps} />);
  else return (<HeaderFull {...newProps}/>)
}

export default Header;