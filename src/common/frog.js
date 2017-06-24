import React from 'react';

export default class Frog extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.cellSize = 20;

        this.getCellStyle = this.getCellStyle.bind(this);
    }

    getCellStyle() {
        return {
            left: this.cellSize * this.props.position.x,
            top: this.cellSize * this.props.position.y
        }
    }

    render() {
        return (
            <div className="frog" style={this.getCellStyle()}>
                F
            </div>)
    }
}
