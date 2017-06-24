import React from 'react';
import TileMapRow from './tile-map-row';

export default class TileMap extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div className="tile-map">
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
