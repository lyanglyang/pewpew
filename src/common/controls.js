import React from 'react';

export default class Controls extends React.Component {

  render() {
    return (
      <div className="login-containter">
        <div className="title">
          Pew Pew
        </div>
      <div className="login-containter">
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
