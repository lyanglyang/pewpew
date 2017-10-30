import React from 'react';
import GLOBAL from '../../constants/index';

export default class TileMapRow extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.cellSize = GLOBAL.CELL_SIZE;
    this.getCellStyle = this.getCellStyle.bind(this);
  }

  getCellStyle(index) {
    return {
      left: this.cellSize * index,
      top: this.cellSize * this.props.rowIndex,
      height: this.cellSize,
      width: this.cellSize
    }
  }

  render() {
    return (
      <div className="tile-map-row">
        {
          this.props.row.map((d, index) => {
            return (
              <div key={index}
                   className={`tile-map-cell block-${d}`}
                   style={this.getCellStyle(index)}>
                {d}
              </div>
            )
          })
        }
      </div>
    );
  }
}
