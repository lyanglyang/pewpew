import React from 'react';

const CELL_SIZE = 20;

export default class Frog extends React.Component {

  getCellStyle = ()=> {
    return {
      left: CELL_SIZE * this.props.position.x,
      top: CELL_SIZE * this.props.position.y
    }
  };

  render() {
    return (
      <div className="frog" style={this.getCellStyle()}>
        F
      </div>)
  }
}
