import React from 'react';
import Scoreboard from '../common/scoreboard';

import _ from 'lodash';

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
          Game Over
        </h1>
        <h1 className="title">
          Score: {_.find(this.props.scores, {owner: this.props.userName}).value}
        </h1>
        <div className="score-container">
          <Scoreboard scores={this.props.scores}/>
        </div>
        <div className="form-row"><button type="button" onClick={this.handleQuit} className="quit">Quit</button></div>
      </div>)
  }
}
