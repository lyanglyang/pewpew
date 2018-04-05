import React from 'react';
import TileMapRow from './tile-map-row';
import GLOBAL from '../constants';

export default class TileMap extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.getStyle = this.getStyle.bind(this);
  }

  getStyle = ()=> {
    return {
      width: this.props.tileMap[0].length * GLOBAL.CELL_SIZE,
      height: this.props.tileMap.length * GLOBAL.CELL_SIZE,
      left: this.props.cameraPosition.x * (GLOBAL.CELL_SIZE) *  (-1),
      top: this.props.cameraPosition.y * (GLOBAL.CELL_SIZE) *  (-1),
    }
  };

  render() {
    return (
      <div className="tile-map" style={this.getStyle()}>
        {
          this.props.tileMap.map((tm, index) => {
            return (
              <TileMapRow key={index}
                          row={tm}
                          rowIndex={index}/>
            )
          })
        }
      </div>)
  }
}
