import React from 'react';

//constants
import GLOBAL from '../constants';

export default class Opponent extends React.Component {

  componentDidMount(){
    this.generateRandomPosition();
  }

  generateRandomPosition(){
    // setInterval(()=>this.props.updatePosition(this.props.index), 300);
  }

  getCellStyle = () =>{
    let position = {
      x: (this.props.opponent.position.x - this.props.cameraFocusPoint.x),
      y: (this.props.opponent.position.y - this.props.cameraFocusPoint.y)
    }
    return {
      left: GLOBAL.CELL_SIZE * position.x,
      top: GLOBAL.CELL_SIZE * position.y
    }
  };

  render() {
    return (
      <div className="snake" style={this.getCellStyle()}>
        {`S${this.props.index}`}
      </div>)
  }
}
