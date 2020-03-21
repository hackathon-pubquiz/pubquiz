import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import {LocalBar} from "@material-ui/icons";

const styles = theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
});

class CheerBackdrop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  componentDidMount() {
    let { socket } = this.props;

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
    return (
      <div>
        <Backdrop className={this.props.classes.backdrop} open={this.state.open} onClick={this.handleClose}>
          <LocalBar style={{ fontSize: '80vh' }}/>
        </Backdrop>
      </div>
    );
  }
}

export default withStyles(styles)(CheerBackdrop);