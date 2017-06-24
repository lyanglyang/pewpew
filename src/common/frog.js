import React from 'react';
import GLOBAL from '../constants';


export default class Frog extends React.Component {

  getCellStyle = ()=> {
    return {
      left: GLOBAL.CELL_SIZE * this.props.position.x,
      top: GLOBAL.CELL_SIZE * this.props.position.y,
      height: (GLOBAL.CELL_SIZE/4),
      width: (GLOBAL.CELL_SIZE/4)
    }
  };

  render() {
    return (
      <div className="frog" style={this.getCellStyle()} onClick={this.props.fireBullet}>
        F
      </div>)
  }
}
