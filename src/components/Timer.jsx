import React, { useEffect } from 'react';

class Timer extends React.Component {
  componentDidMount() {
    this.interval = setInterval(() => {
      if (this.props.timeLeft > 0) {
        this.props.onTick();
      } else {
        clearInterval(this.interval);
        this.props.onTimeUp();
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return <div className="timer">Time Left: {this.props.timeLeft}s</div>;
  }
}

export default Timer;
