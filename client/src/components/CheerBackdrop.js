import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import { withStyles} from '@material-ui/core/styles';
import { ReactComponent as CocktailIcon } from "../img/cocktail.svg";
import { ReactComponent as PintIcon } from "../img/pint.svg";

const styles = theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  icon: {
    'width': '50vmin',
    'height': '50vmin',
  },
  animContainer: {
    display: 'flex',
    'flex-direction': 'row',
  },
  animLeft: {
    'animation-duration': '1s',
    'animation-name': '$clinkLeft',
  },
  animRight: {
    'animation-duration': '1s',
    'animation-name': '$clinkRight',
  },

  '@keyframes clinkLeft': {
    from: {
      transform: 'translateX(-20%) rotate(0)',
      opacity: '40%',
    },
    to: {
      transform: 'translateX(10%) rotate(10deg)',
      opacity: '100%',
    }
  },
  '@keyframes clinkRight': {
    from: {
      transform: 'translateX(20%) rotate(0)',
      opacity: '40%',
    },
    to: {
      transform: 'translateX(-10%) rotate(-10deg)',
      opacity: '100%',
    }
  }
});

class CheerBackdrop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  componentDidMount() {
    let {socket} = this.props;

    socket.on("rec_cheer", this.handleIncomingCheer);
  }

  handleIncomingCheer = () => {
    this.setState({open: true});
    setTimeout(() => this.setState({open: false}), 1000);
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render() {
    let {classes} = this.props;
    let {open} = this.state;

    return (
      <div>
        <Backdrop className={classes.backdrop} open={open} onClick={this.handleClose}>
          <div className={classes.animContainer}>
            <div className={open ? classes.animLeft : null}>
              <CocktailIcon className={classes.icon}/>
            </div>
            <div className={open ? classes.animRight : null}>
              <PintIcon className={classes.icon}/>
            </div>
          </div>
        </Backdrop>
      </div>
    );
  }
}

export default withStyles(styles)(CheerBackdrop);