import React from 'react';


//constants
import GLOBAL from '../constants';

export default class Frog extends React.Component {

  getCellStyle = ()=> {
    return {
      left: GLOBAL.CELL_SIZE * this.props.position.x,
      top: GLOBAL.CELL_SIZE * this.props.position.y
    }
  };

  render() {
    return (
      <div className="frog" style={this.getCellStyle()}>
        F
      </div>)
  }
}
