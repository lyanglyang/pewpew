import React from 'react';
import TileMap from '../tile-map';
import Frog from '../common/frog';
import Opponents from '../opponents';
import GLOBAL from '../constants';
import backand from '../common/Backand';
import axios from 'axios';
import uuidv1 from 'uuid/v1';


import {
  detectCollision
} from '../utils/geometry';

const ANONYMOUS_TOKEN = 'fb44c3c7-d0ca-40a6-81d1-5bd6484af3be';
axios.defaults.headers.common['AnonymousToken'] = ANONYMOUS_TOKEN;

export default class World extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      visibleTileMap: [],
      cameraFocusPoint: {},

      bulletFired: false,

      player: {
        id: uuidv1(),
        relativePosition: {},
        position: {}
      },

      opponents: {},

    };

    this.screenDimensions = {};
    this.cameraBarrierPoints = {};
    this.mapStartPoints = {};

    this.setScreenDimensions = this.setScreenDimensions.bind(this);
    this.setScreenDimensions = this.setScreenDimensions.bind(this);
    this.setPlayerPosition = this.setPlayerPosition.bind(this);
    this.checkFrogCollision = this.checkFrogCollision.bind(this);
  }

  updatePosition = (index) => {
    var cloneState = Object.assign({}, this.state);
    cloneState.opponents = cloneState.opponents.slice();
    cloneState.opponents[index] = Object.assign({}, cloneState.opponents[index]);
    if (cloneState.opponents[index].y > 20) {
      cloneState.opponents[index].x += 1;
    } else {
      cloneState.opponents[index].y += 1;
    }
    this.setState(cloneState);
  };

  componentDidMount() {
    this.connectBackand();
    this.setScreenDimensions({x: 9, y: 5});
    let startingPlayerPosition = {
      x: 2,
      y: 2
    };
    this.setCameraFocus(startingPlayerPosition);
    this.setPlayerPosition(startingPlayerPosition);
  }

  getRelativePosition({x, y}) {
    return {
      x: x - this.mapStartPoints.x,
      y: y - this.mapStartPoints.y
    };
  }

  connectBackand = () => {

    axios.post('https://api.backand.com/1/function/general/game', {
      eventName: 'new-player',
      player: {
        x: this.state.player.position.x,
        y: this.state.player.position.y,
        id: this.state.player.id,
        name: this.state.player.name
      }
    });
    this.setBackandEvents();
  };

  setBackandEvents = () => {
    backand.on('new-player', (data) => {
      let _data = {};
      data[1]['Value'].forEach((d) => {
        _data[d['Key']] = d['Value']
      });
      let player = {
        position: {
          x: _data.x,
          y: _data.y
        },
        id: _data.id
      };
      if (_data.id === this.state.player.id) {
        return;
      }
      this.state.opponents[player.id] = player;
      this.setState({
        opponents: this.state.opponents
      });

    });
    backand.on('player-update', (data) => {
      console.log("jerer",data)
      let _data = {};
      data[1]['Value'].forEach((d) => {
        _data[d['Key']] = d['Value']
      });
      let player = {
        position: {
          x: _data.x,
          y: _data.y
        },
        id: _data.id
      };
      if (_data.id === this.state.player.id) {
        return;
      }
      this.state.opponents[player.id] = player;
      this.setState({
        opponents: this.state.opponents
      });
    });
  };

  setPlayerPosition({x, y}) {
    //BOUNDARY LIMIT VALIDATION
    if (x < 0 || x > (this.props.worldMap[0].length - 1) || y < 0 || y > (this.props.worldMap.length - 1)) {
      return;
    }
    let position = {
      x: x,
      y: y
    };
    if (this.checkFrogCollision(position)) {
      return;
    }
    this.setCameraFocus(position);
    this.state.player.position = position;
    this.state.player.relativePosition = {
      x: (position.x - this.state.cameraFocusPoint.x),
      y: (position.y - this.state.cameraFocusPoint.y)
    };
    this.setState({
      player: this.state.player
    });
    axios.post('https://api.backand.com/1/function/general/game', {
      eventName: 'player-update',
      player: {
        x: this.state.player.position.x,
        y: this.state.player.position.y,
        id: this.state.player.id,
        name: this.state.player.name
      }
    });
  }

  setScreenDimensions({x, y}) {
    this.screenDimensions = {
      x: x,
      y: y,
      xradius: (x - 1) / 2,
      yradius: (y - 1 ) / 2
    };
    this.cameraBarrierPoints = {
      left: this.screenDimensions.xradius,
      right: (this.props.worldMap[0].length - this.screenDimensions.xradius - 1),
      top: this.screenDimensions.yradius,
      bottom: (this.props.worldMap.length - this.screenDimensions.yradius - 1)
    };
  }

  setCameraFocus({x, y}) {
    let cameraFocus = {};
    let cameraBarrierPoints = this.cameraBarrierPoints;

    cameraFocus.x = (x > cameraBarrierPoints.left) ? (x - cameraBarrierPoints.left) : 0;
    cameraFocus.x = (x < cameraBarrierPoints.right) ? cameraFocus.x : (cameraBarrierPoints.right - cameraBarrierPoints.left);
    cameraFocus.y = (y > cameraBarrierPoints.top) ? (y - cameraBarrierPoints.top) : 0;
    cameraFocus.y = (y < cameraBarrierPoints.bottom) ? cameraFocus.y : (cameraBarrierPoints.bottom - cameraBarrierPoints.top);

    this.state.cameraFocusPoint = cameraFocus;
    this.setState({
      cameraFocusPoint: this.state.cameraFocusPoint
    });
  }


  checkFrogCollision({x, y}) {
    let frogDimensions = {
      x: x * GLOBAL.CELL_SIZE,
      y: y * GLOBAL.CELL_SIZE,
      width: (GLOBAL.CELL_SIZE / 4),
      height: (GLOBAL.CELL_SIZE / 4)
    };
    for (let i = 0; i < this.props.worldMap.length; i++) {
      let tileRow = this.props.worldMap[i];
      for (let j = 0; j < tileRow.length; j++) {
        let tileCell = tileRow[j];


        let tileCellObject = tileObject[tileCell];

        if (tileCellObject && tileCellObject.rigid) {
          let tileDimensions = {
            x: (j) * GLOBAL.CELL_SIZE,
            y: (i) * GLOBAL.CELL_SIZE,
            width: GLOBAL.CELL_SIZE,
            height: GLOBAL.CELL_SIZE
          };
          if (detectCollision(tileDimensions, frogDimensions)) {
            return true;
            break;
          }
        }
      }
    }
    return false;
  }

  pewpew({x, y}) {
    let frogDimensions = {
      x: x * GLOBAL.CELL_SIZE,
      y: y * GLOBAL.CELL_SIZE,
      width: (GLOBAL.CELL_SIZE / 4),
      height: (GLOBAL.CELL_SIZE / 4)
    };
    for (let i = 0; i < this.state.opponents.length; i++) {
      let opponent = this.state.opponents[i];
      let tileDimensions = {
        x: opponent.x * GLOBAL.CELL_SIZE,
        y: opponent.y * GLOBAL.CELL_SIZE,
        width: (GLOBAL.CELL_SIZE / 4),
        height: (GLOBAL.CELL_SIZE / 4)
      };
      if (detectCollision(tileDimensions, frogDimensions)) {
        let opponents = this.state.opponents;
        opponents.splice(i, 1);
        this.state.opponents = opponents;
        this.setState({
          opponents: this.state.opponents
        });
        return false;
      }
    }
  }

  getWorldStyle = () => {
    return {
      height: this.screenDimensions.y * GLOBAL.CELL_SIZE,
      width: this.screenDimensions.x * GLOBAL.CELL_SIZE
    }
  };

  render() {
    return (
      <div className="world-container" style={this.getWorldStyle()}>
        <TileMap tileMap={this.props.worldMap}
                 cameraPosition={this.state.cameraFocusPoint}/>
        <Frog player={this.state.player}
              pewpew={this.pewpew.bind(this)}
              setPlayerPosition={this.setPlayerPosition}/>
        {
          Object.keys(this.state.opponents).map((opponentKey, index) =>
            <Opponents key={index} cameraFocusPoint={this.state.cameraFocusPoint}
                       index={index} opponent={this.state.opponents[opponentKey]}/>
          )
        }
      </div>
    )
  }
}

const tileObject = {
  0: {},
  1: {},
  2: {
    rigid: true
  },
  3: {
    rigid: true
  },
  5: {
    rigid: true
  }
};
