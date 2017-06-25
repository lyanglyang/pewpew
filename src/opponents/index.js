import React from 'react';

//constants
import GLOBAL from '../constants';
import { Line } from 'rc-progress';

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
    };
    return {
      height: (GLOBAL.CELL_SIZE / 4),
      width: (GLOBAL.CELL_SIZE / 4),
      left: GLOBAL.CELL_SIZE * position.x,
      top: GLOBAL.CELL_SIZE * position.y
    }
  };

  getSwordActionStyle = () => {
    let swordDirection = this.props.opponent.swordAction.swordDirection;
    return {
      height: (GLOBAL.CELL_SIZE / 4),
      width: (GLOBAL.CELL_SIZE / 4),
      left: (swordDirection['left']) * (GLOBAL.CELL_SIZE / 4),
      top: (swordDirection['top']) * (GLOBAL.CELL_SIZE / 4),
    }
  };

  checkColor = ()=>{
    if(this.props.opponent.health > 50)
      return '#0f0';
    else
      return '#f00';
  };

  render() {
    return (
      <div className="snake" style={this.getCellStyle()}>
        <span className="player-name">{this.props.opponent.name}</span>
        <Line className="health-bar" percent={this.props.opponent.health} strokeWidth="4" strokeColor={this.checkColor()}/>
        {
          (this.props.opponent.swordAction.active) ?
            <div className="sword-action-wrapper">
              <div className="sword-action" style={this.getSwordActionStyle()}>
              </div>
            </div>
            : null
        }
      </div>)
  }
}
