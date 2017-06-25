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
      <div className="login-container">
        <h1 className="title">
          Pew Pew
        </h1>
        <h1 className="title">
          Game Over
        </h1>
        <div className="score-container">
          Score: 100
        </div>
        <div className="form-row"><button type="button" onClick={this.handleRestart} className="restart"> Restart </button></div>
        <div className="form-row"><button type="button" onClick={this.handleQuit} className="quit">Quit</button></div>
      </div>)
  }
}
