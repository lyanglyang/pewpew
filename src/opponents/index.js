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
    let {x, y} = this.props.position,
      display = "inline-block";
    if (x > 20 || y > 20){
      display = "none";
    }
    return {
      left: GLOBAL.CELL_SIZE * x,
      top: GLOBAL.CELL_SIZE * y,
      display
    }
  };

  render() {
    return (
      <div className="snake" style={this.getCellStyle()}>
        {`S${this.props.index}`}
      </div>)
  }
}
