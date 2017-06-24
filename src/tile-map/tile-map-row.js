import React from 'react';

export default class TileMapRow extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <tr>
                {
                    this.props.row.map((d, index) => {
                        return (
                            <td key={index} className={`tile-map-row block-${d}`}>
                                {d}
                            </td>
                        )
                    })
                }
            </tr>)
    }
}
