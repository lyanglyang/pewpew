import React from 'react';

export default class Controls extends React.Component {

  render() {
    return (
      <div className="login-container">
        <h1 className="title">
          Controls
        </h1>
      <div>
        <ul className="game-list">
          <li><h3>Movement:</h3></li>
          <li>Up, Down, Left and Right Arrow keys</li>
        </ul>
        <ul className="game-list">
          <li><h3>Attack:</h3></li>
          <li>Use your voice for firing</li>
        </ul>
        <button type="button" className="back-btn" onClick={this.props.goBack}> Back </button>
      </div>
    </div>)
  }
}
