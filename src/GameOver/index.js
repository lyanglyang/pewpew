import React from 'react';

export default class GameOver extends React.Component {

  handleRestart = ()=>{
    this.props.toggleGame();
    alert("need to handle restart");
  };

  handleQuit = () => {
    this.props.closeSession();
    alert("need to handle quit");
  };

  render() {
    return (
      <div className="game-over-containter">
        <div className="score-container">
          Score: 100
          Killed: 10
        </div>
        GAME OVER
        <button type="button" onClick={this.handleRestart} className="restart"> Restart </button>
        <button type="button" onClick={this.handleQuit} className="quit">Quit</button>
      </div>)
  }
}
