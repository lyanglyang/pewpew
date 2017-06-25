import React from 'react';

export default class Controls extends React.Component {

  render() {
    return (
      <div className="login-container">
        <h1 className="title">
          Pew Pew
        </h1>
      <div>
        Up
        Down
        left
        Right
        and
        <button type="button" className="back-btn" onClick={this.props.goBack}> Back </button>
      </div>
    </div>)
  }
}
