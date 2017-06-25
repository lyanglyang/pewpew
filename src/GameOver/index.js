import React from 'react';
import Scoreboard from '../common/scoreboard';

export default class GameOver extends React.Component {

  handleRestart = ()=>{
    this.props.toggleGame();
  };

  handleQuit = () => {
    this.props.clearSession();
  };

  render() {
    return (
      <div className="login-container">
        <h1 className="title">
          Pew Pew
        </h1>
        <h1 className="title">
          Game Over
        </h1>
        <div className="score-container">
          <Scoreboard scores={this.props.scores}/>
        </div>
        <div className="form-row"><button type="button" onClick={this.handleQuit} className="quit">Quit</button></div>
      </div>)
  }
}
