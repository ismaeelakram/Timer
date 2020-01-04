import React from 'react';
import './App.css';
import pauseIcon from './pause-icon.png';
import playIcon from './play-icon.png';

const { ipcRenderer } = window.require('electron');

class App extends React.Component {
  constructor(props) {
    super(props);

    this.pauseBtnIcon = pauseIcon;
    this.state = {
        seconds: 0,
        secondsParsed: '00:00:00',
        paused: false
    }
  }

  tick() {
      this.setState(state => ({
          seconds: state.seconds + 1,
          secondsParsed: new Date(this.state.seconds * 1000).toISOString().substr(11, 8)
      }));
  }

  reset() {
      this.setState(state => ({
          seconds: 0
      }));
  }

  pause(){

      if(this.state.paused === false){
        ipcRenderer.send('paused', 'ping');
          this.pauseBtnIcon = playIcon;
          clearInterval(this.interval);
          this.setState(state => ({
              paused: true
          }));
      }else{
        ipcRenderer.send('resumed', 'ping');
          this.pauseBtnIcon = pauseIcon;
          this.interval = setInterval(() => this.tick(), 1000);
          this.setState(state => ({
              paused: false
          }));
      }
  }

  componentDidMount() {
      this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
      clearInterval(this.interval);
  }

  render() {
    return (
        <div className="container">
            <h1>{this.state.secondsParsed}</h1>
            <button className="pauseBtn" onClick={() => this.pause()}><img alt="Pause" className="pauseIcon" src={this.pauseBtnIcon} /></button>
        </div>
    );
  }

}

export default App;
