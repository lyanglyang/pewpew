import React from 'react';
import TileMap from '../tile-map';
import Frog from '../common/frog';

export default class World extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            visibleTileMap: [],
            cameraFocusPoint: {},

            player: {
                relativePosition: {},
                position: {}
            }
        };

        this.screenDimensions = {};
        this.cameraBarrierPoints = {};

        this.setVisibleMap = this.setVisibleMap.bind(this);
        this.setScreenDimensions = this.setScreenDimensions.bind(this);
        this.setScreenDimensions = this.setScreenDimensions.bind(this);
        this.setKeyBindings = this.setKeyBindings.bind(this);
        this.setPlayerPosition = this.setPlayerPosition.bind(this);
    }

    componentDidMount() {
        this.setScreenDimensions({size: 21});
        this.setKeyBindings();
        let startingPlayerPosition = {
            x: 2,
            y: 2
        };
        this.setCameraFocus(startingPlayerPosition);
        this.setPlayerPosition(startingPlayerPosition);
    }

    getRelativePosition({x, y}) {

        let mapStartPoints = {
            x: (this.state.cameraFocusPoint.x - this.screenDimensions.radius),
            y: (this.state.cameraFocusPoint.y - this.screenDimensions.radius),
        };

        //TODO: BOUNDARY VALUE VALIDATIONS
        return {
            x: x - mapStartPoints.x,
            y: y - mapStartPoints.y
        };
    }

    setPlayerPosition({x, y}) {
        let position = {
            x: x,
            y: y
        };
        this.state.player.position = position;
        this.state.player.relativePosition = this.getRelativePosition(position);
        this.setState({
            player: this.state.player
        });
        this.setCameraFocus(position);
    }

    setScreenDimensions({size}) {
        this.screenDimensions = {
            size: size,
            radius: (size - 1) / 2
        };
        this.cameraBarrierPoints = {
            left: this.screenDimensions.radius,
            right: (this.props.worldMap[0].length - this.screenDimensions.radius - 1),
            top: this.screenDimensions.radius,
            bottom: (this.props.worldMap.length - this.screenDimensions.radius - 1)
        };
    }

    setKeyBindings() {
        document.onkeydown = (e) => {
            e = e || window.event;
            let playerPosition = Object.assign({}, this.state.player.position);
            switch (e.which || e.keyCode) {
                case 37:
                    playerPosition.x -= 1;
                    break;

                case 39:
                    playerPosition.x += 1;
                    break;

                case 38:
                    playerPosition.y -= 1;
                    break;

                case 40:
                    playerPosition.y += 1;
                    break;

                default:
                    return;
                    break;
            }
            console.log(playerPosition)
            this.setPlayerPosition(playerPosition);
        }
    }

    setCameraFocus({x, y}) {
        let cameraFocus = {};
        let cameraBarrierPoints = this.cameraBarrierPoints;

        cameraFocus.x = (x > cameraBarrierPoints.left) ? x : cameraBarrierPoints.left;
        cameraFocus.x = (x < cameraBarrierPoints.right) ? cameraFocus.x : cameraBarrierPoints.right;
        cameraFocus.y = (y > cameraBarrierPoints.top) ? y : cameraBarrierPoints.top;
        cameraFocus.y = (y < cameraBarrierPoints.bottom) ? cameraFocus.y : cameraBarrierPoints.bottom;

        this.state.cameraFocusPoint = cameraFocus;
        this.setState({
            cameraFocusPoint: this.state.cameraFocusPoint
        });
        this.setVisibleMap();
    }

    setVisibleMap() {
        let mapStartPoints = {
            x: (this.state.cameraFocusPoint.x - this.screenDimensions.radius),
            y: (this.state.cameraFocusPoint.y - this.screenDimensions.radius),
        };
        this.state.visibleTileMap = this.props.worldMap.slice(mapStartPoints.y, (mapStartPoints.y + this.screenDimensions.size)).map((row) => {
            return row.slice(mapStartPoints.x, (mapStartPoints.x + this.screenDimensions.size));
        });
        this.setState({
            visibleTileMap: this.state.visibleTileMap
        });
    }

    render() {
        return (
            <div className="world-container">
                <TileMap tileMap={this.state.visibleTileMap}/>
                <Frog position={this.state.player.relativePosition}/>
            </div>
        )
    }
}
