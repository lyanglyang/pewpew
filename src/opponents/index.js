import React from 'react';

export default class Opponent extends React.Component {

  componentDidMount(){
    this.generateRandomPosition();
  }

  generateRandomPosition(){
    setInterval(()=>this.props.updatePosition(this.props.index), 300);
  }

  getCellStyle = () =>{
    let {x, y} = this.props.position,
      cellSize = 20,
      display = "inline-block";
    if (x > 20 || y > 20){
      display = "none";
    }
    return {
      left: cellSize * x,
      top: cellSize * y,
      display
    }
  }

  render() {
    return (
      <div className="snake" style={this.getCellStyle()}>
        {`S${this.props.index}`}
      </div>)
  }
}
