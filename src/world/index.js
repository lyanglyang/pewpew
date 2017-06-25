import React from 'react';
import TileMap from '../tile-map';
import Frog from '../common/frog';
import Opponents from '../opponents';
import GLOBAL from '../constants';
import backand from '@backand/vanilla-sdk';
import axios from 'axios';


import {
  detectCollision
} from '../utils/geometry';

const tileObject = {
  0: {},
  1: {},
  2: {
    rigid: true
  },
  3: {
    rigid: true
  },
};

export default class World extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      visibleTileMap: [],
      cameraFocusPoint: {},

      bulletFired: false,

      player: {
        relativePosition: {},
        position: {}
      },

      opponents: [
        {x: 1, y: 1},
        {x: 3, y: 3},
        {x: 5, y: 5}
      ]

    };

    this.screenDimensions = {};
    this.cameraBarrierPoints = {};
    this.mapStartPoints = {};

    this.setVisibleMap = this.setVisibleMap.bind(this);
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
    this.setScreenDimensions({size: 5});
    let startingPlayerPosition = {
      x: 2,
      y: 2
    };
    this.setCameraFocus(startingPlayerPosition);
    this.setPlayerPosition(startingPlayerPosition);
    this.connectBackand();
  }

  getRelativePosition({x, y}) {
    return {
      x: x - this.mapStartPoints.x,
      y: y - this.mapStartPoints.y
    };
  }

  connectBackand = () => {
    const ANONYMOUS_TOKEN = 'fb44c3c7-d0ca-40a6-81d1-5bd6484af3be';
    backand.init({
      appName: 'pewpew',
      signUpToken: "cf706c34-ce4b-45f1-80c0-2a517fef995b",
      anonymousToken: ANONYMOUS_TOKEN,
      runSocket: true,
    });
    backand.signup(`guest${new Date().getTime()}`, "user", `user+${new Date().getTime()}@reactriot.com`, "test123", "test123", {})
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      });
    axios.defaults.headers.common['AnonymousToken'] = ANONYMOUS_TOKEN;
    this.setBackandEvents();
  };

  setBackandEvents = () => {
    backand.on('items_updated', function (data) {
      console.log('items_updated');
      console.log(data);
    });
    setInterval(()=> {
      axios.get('https://api.backand.com/1/function/general/game');
    }, 1000)
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
    this.state.player.position = position;
    this.state.player.relativePosition = this.getRelativePosition(position);
    this.setState({
      player: this.state.player
    });
    this.setCameraFocus(position);
    console.log(this.state.player.position, this.mapStartPoints, this.state.player.relativePosition)
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
    this.mapStartPoints = {
      x: (this.state.cameraFocusPoint.x - this.screenDimensions.radius),
      y: (this.state.cameraFocusPoint.y - this.screenDimensions.radius),
    };
    this.state.visibleTileMap = this.props.worldMap.slice(this.mapStartPoints.y, (this.mapStartPoints.y + this.screenDimensions.size)).map((row) => {
      return row.slice(this.mapStartPoints.x, (this.mapStartPoints.x + this.screenDimensions.size));
    });
    this.setState({
      visibleTileMap: this.state.visibleTileMap
    });
  }

  checkFrogCollision({x, y}) {
    let frogDimensions = {
      x: x * GLOBAL.CELL_SIZE,
      y: y * GLOBAL.CELL_SIZE,
      width: (GLOBAL.CELL_SIZE / 4),
      height: (GLOBAL.CELL_SIZE / 4)
    };
    for (let i = 0; i < this.state.visibleTileMap.length; i++) {
      let tileRow = this.state.visibleTileMap[i];
      for (let j = 0; j < tileRow.length; j++) {
        let tileCell = tileRow[j];
        let tileCellObject = tileObject[tileCell];
        if (tileCellObject && tileCellObject.rigid) {
          let tileDimensions = {
            x: i * GLOBAL.CELL_SIZE,
            y: j * GLOBAL.CELL_SIZE,
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

  render() {
    return (
      <div className="world-container">
        <TileMap tileMap={this.state.visibleTileMap}/>
        <Frog player={this.state.player}
              pewpew={this.pewpew.bind(this)}
              setPlayerPosition={this.setPlayerPosition}/>
        {this.state.opponents.map((position, index) =>
          <Opponents key={index} updatePosition={this.updatePosition}
                     index={index} position={this.getRelativePosition(position)}/>)
        }
      </div>
    )
  }
}
