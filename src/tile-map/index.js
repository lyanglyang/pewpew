import React from 'react';
import TileMapRow from './tile-map-row';

export default class TileMap extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <table className="tile-map">
                <tbody>
                {
                    this.props.tileMap.map((tm, index) => {
                        return (
                            <TileMapRow row={tm} key={index}/>
                        )
                    })
                }
                </tbody>
            </table>)
    }
}
