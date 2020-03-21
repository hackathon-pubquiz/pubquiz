import React, { Component } from "react";
import ReactPlayer from "react-player";
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import VolumeUp from '@material-ui/icons/VolumeUp';
import VolumeOff from '@material-ui/icons/VolumeOff';
import PlayArrow from '@material-ui/icons/PlayArrow';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = { 
        volume: 10,
        volumeOn: true,
        playing: false,
        secondsToPlay: 5,
        progress: 0
    };
  }

  ref = player => {
    this.player = player
  }

  render() {
    const { volume, volumeOn, playing, progress } = this.state
    
    const changeVol = (event, vol) => {
        this.setState({ volume:parseFloat(vol), volumeOn: true })
    }
    
    const toggleVolume = event => {
        this.setState({ volumeOn: !volumeOn });
    };
    
    const getVolume = () => {
        if (volumeOn) return volume / 100;
        return 0;
    }

    const startPlaying = () => {
        this.player.seekTo(parseFloat(0))
        this.setState({ playing: true });
        this.timer = setInterval(updateProgess, 200);
    }

    const updateProgess = () => {
        const newProgress = 100 / this.state.secondsToPlay * this.player.getCurrentTime()
        this.setState({progress: newProgress})

        if (newProgress >= 100){
            this.setState({ playing: false, progress: 100})
            return () => {
                clearInterval(this.timer);
            };
        }
    } 

    return (
    <div className="player_root">
        <ReactPlayer 
            ref={this.ref}
            url="https://www.youtube.com/watch?v=z9Uz1icjwrM"
            playing={playing}
            height="0px"
            volume={getVolume()}/>
        <Grid container spacing={2}>    
            <Grid item xs={2}>
                <IconButton aria-label="delete" onClick={startPlaying} disabled={playing}>
                    <PlayArrow />
                </IconButton>
            </Grid>
            <Grid item xs={4}>
                <LinearProgress variant="determinate" value={progress} />
            </Grid>
            <Grid item xs={2}>
                <IconButton
                    checked={volumeOn}
                    onClick={toggleVolume}>
                    {!volumeOn && <VolumeOff/>}
                    {volumeOn && <VolumeUp/>}
                </IconButton>
            </Grid>
            <Grid item xs={4}>
                <Slider value={volume} onChange={changeVol} aria-labelledby="continuous-slider" />
            </Grid>
        </Grid>
    </div>
    );
  }
}

export default Player;
