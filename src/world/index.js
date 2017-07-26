import React from 'react';
import TileMap from '../tile-map';
import Frog from '../common/frog';
import Opponents from '../opponents';
import GLOBAL from '../constants';
import backand from '../common/Backand';
import server from '../common/server';
import axios from 'axios';
import uuidv1 from 'uuid/v1';
import {
  detectCollision
} from '../utils/geometry';

import Scoreboard from '../common/scoreboard';

const ANONYMOUS_TOKEN = 'fb44c3c7-d0ca-40a6-81d1-5bd6484af3be';
axios.defaults.headers.common['AnonymousToken'] = ANONYMOUS_TOKEN;

const POSSIBLE_SPAWN_POINTS = [
  {x: 3, y: 5},
  {x: 9, y: 9},
  {x: 10, y: 4},
  {x: 10, y: 13},
  {x: 14, y: 1},
  {x: 14, y: 5}
];

const INTERACTIVE_TEXTS = {
  dead: ["%s : Rest in Peace"],
  damageDealt: ["Pew pew pew", "Fight !!!", "It's getting intense"],
  underAttack: ["Taking fire needs assitance", "Run"],
};

export default class World extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      interactiveText: '',
      cameraFocusPoint: {},
      player: {
        id: JSON.parse(localStorage.getItem('user')).id,
        name: props.userName,
        relativePosition: {},
        position: {},
        health: 100,
        swordAction: {
          active: false,
          swordDirection: {
            left: 0,
            top: 0
          }
        },
        score: 0,
        isActive: true,
        rand: Math.floor(Math.random() * 3) + 1
      },
      opponents: {},
    };
console.log(this.state.player)
    this.screenDimensions = {};
    this.cameraBarrierPoints = {};

    this.setScreenDimensions = this.setScreenDimensions.bind(this);
    this.setScreenDimensions = this.setScreenDimensions.bind(this);
    this.setPlayerPosition = this.setPlayerPosition.bind(this);
    this.checkFrogCollision = this.checkFrogCollision.bind(this);
  }

  componentDidMount() {
    this.setBackandEvents();
    this.setScreenDimensions({x: 9, y: 4});
    let startingPlayerPosition = POSSIBLE_SPAWN_POINTS[Math.floor(Math.random() * 5) + 0];
    this.setCameraFocus(startingPlayerPosition);
    this.setPlayerPosition(startingPlayerPosition);
    let {player} = this.state;
    setInterval(() => {
      if (player.health <= 100) {
        player.health += 4;
        if (player.health > 100) {
          player.health = 100;
        }
        this.setState({
          player: this.state.player
        });
      }
    }, 2000);
  }

  setInteractiveText(text, priority) {
    let timeout = 1000;
    if (priority) {
      this.disableInteractiveText = false;
      timeout = 3000;
    }
    if (this.disableInteractiveText) {
      return;
    }
    this.disableInteractiveText = true;
    this.setState({
      interactiveText: text
    });
    setTimeout(() => {
      this.setState({
        interactiveText: ""
      });
      this.disableInteractiveText = false;
    }, timeout);
  }

  buildPlayerJson = () => {
    return {
      x: this.state.player.position.x,
      y: this.state.player.position.y,
      id: this.state.player.id,
      name: this.state.player.name,
      health: this.state.player.health,
      swdl: this.state.player.swordAction.swordDirection.left,
      swdt: this.state.player.swordAction.swordDirection.top,
      swaa: this.state.player.swordAction.active,
      swad: this.state.player.swordAction.movingDirection,
      score: this.state.player.score,
      isActive: this.state.player.isActive,
      rand: this.state.player.rand,
    }
  };

  sanitizePlayerJsonData = (data) => {
    let _data = {};

    if(data[1]&&data[1]['value']){
      data[1]['Value'].forEach((d) => {
        _data[d['Key']] = d['Value']
      });
    }else if(typeof data==="object"){
      _data = data;
    }else{
      _data = JSON.parse(data);
    }

    return {
      health: _data.health,
      position: {
        x: _data.x,
        y: _data.y
      },
      swordAction: {
        active: _data.swaa,
        swordDirection: {
          left: _data.swdl,
          top: _data.swdt
        },
        movingDirection: _data.swad,
      },
      id: _data.id,
      score: _data.score,
      name: _data.name,
      isActive: _data.isActive,
      rand: _data.rand,
    };
  };

  setBackandEvents = () => {
    server.handlePlayerUpdate((data) => {
      let player = this.sanitizePlayerJsonData(data);
      let {opponents} = this.state;

      if (player.id === this.state.player.id) {
        return;
      }
      if (player.health <= 0) {
        this.setInteractiveText(INTERACTIVE_TEXTS.dead[Math.floor(Math.random() * (INTERACTIVE_TEXTS.dead.length - 1)) + 0].replace("%s", player.name), true);
        delete opponents[player.id];
      } else {
        opponents[player.id] = player;
      }
      this.setState({
        opponents: opponents
      });
    });

    server.handlePlayerHit((data) => {
      let player = this.sanitizePlayerJsonData(data);
      if (player.id === this.state.player.id) {
        player = this.state.player;
        player.health -= 10;
        this.setInteractiveText(INTERACTIVE_TEXTS.underAttack[Math.floor(Math.random() * (INTERACTIVE_TEXTS.underAttack.length - 1)) + 0].replace("%s", player.name));
        if (player.health <= 0) {
          this.state.player.isActive = false;
          this.setState({
            player: this.state.player
          });
          this.props.closeGame(this.getScores());
        }
        return;
      }
      let opponent = this.state.opponents[player.id];
      if (opponent) {
        opponent.health -= 10;
        if (opponent.health <= 0) {
          this.setInteractiveText(INTERACTIVE_TEXTS.dead[Math.floor(Math.random() * (INTERACTIVE_TEXTS.underAttack.length - 1)) + 0].replace("%s", opponent.name), true);
          delete this.state.opponents[player.id];
        } else {
          this.state.opponents[player.id] = opponent;
        }
        this.setState({
          opponents: this.state.opponents
        });
      }
    });

    server.handlePlayerUseSword((data) => {
      let player = this.sanitizePlayerJsonData(data);
      if (player.id === this.state.player.id) {
        return;
      }
      this.state.opponents[player.id] = player;
      this.setState({
        opponents: this.state.opponents
      });
      if (player && player.swordAction.active) {
        setTimeout(() => {
          if (this.state.opponents[player.id]) {
            this.state.opponents[player.id]['swordAction']['active'] = false;
            this.setState({
              opponents: this.state.opponents
            });
          }
        }, 100);
      }
    });
    // backand.on('player-hit',);
    // backand.on('player-use-sword',);
  };

  setPlayerPosition({x, y}) {
    if (!this.state.player.isActive) {
      return;
    }
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
    let playerJson = this.buildPlayerJson();
    // axios.post('https://api.backand.com/1/function/general/game', {
    //   eventName: 'player-update',
    //   player: playerJson
    // });
    server.updatePlayer(playerJson)
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

  pewpew({x, y, swordDirection, movingDirection}) {
    if (!this.state.player.isActive) {
      return;
    }
    let frogDimensions = {
      x: x * GLOBAL.CELL_SIZE,
      y: y * GLOBAL.CELL_SIZE,
      width: (GLOBAL.CELL_SIZE / 4),
      height: (GLOBAL.CELL_SIZE / 4)
    };

    this.state.player.swordAction = {
      active: true,
      swordDirection: swordDirection,
      movingDirection: movingDirection
    };
    this.setState({
      player: this.state.player
    });

    let _player = this.buildPlayerJson();

    _player.swaa = true;
    axios.post('https://api.backand.com/1/function/general/game', {
      eventName: 'player-use-sword',
      player: _player
    });

    server.useSword({player: _player});

    setTimeout(() => {
      this.state.player.swordAction.active = false;
      this.setState({
        player: this.state.player
      });
    }, 100);

    for (let opponentId in this.state.opponents) {
      let opponent = this.state.opponents[opponentId];
      let tileDimensions = {
        x: opponent.position.x * GLOBAL.CELL_SIZE,
        y: opponent.position.y * GLOBAL.CELL_SIZE,
        width: (GLOBAL.CELL_SIZE / 4),
        height: (GLOBAL.CELL_SIZE / 4)
      };
      if (detectCollision(tileDimensions, frogDimensions)) {
        axios.post('https://api.backand.com/1/function/general/game', {
          eventName: 'player-hit',
          player: {
            id: opponentId
          }
        });
        server.hitOpponent({player: {id: opponentId}});
        this.setInteractiveText(INTERACTIVE_TEXTS.damageDealt[Math.floor(Math.random() * (INTERACTIVE_TEXTS.damageDealt.length - 1)) + 0].replace("%s", this.state.player.name));
        this.state.player.score += 1;
        this.setState({
          player: this.state.player
        });

        let playerJson = this.buildPlayerJson();
        axios.post('https://api.backand.com/1/function/general/game', {
          eventName: 'player-update',
          player: playerJson
        });
        server.updatePlayer(playerJson)
      }
    }
  }

  getWorldStyle = () => {
    return {
      height: this.screenDimensions.y * GLOBAL.CELL_SIZE,
      width: this.screenDimensions.x * GLOBAL.CELL_SIZE
    }
  };

  getScores = () => {
    let scores = [];
    scores.push({
      owner: this.state.player.name,
      value: this.state.player.score
    });
    Object.keys(this.state.opponents).map((opponentKey, index) => {
      let opponent = this.state.opponents[opponentKey];
      scores.push({
        owner: opponent.name,
        value: opponent.score
      });
    });
    return scores;
  };

  render() {
    return (
      <div className="container">
        {
          this.state.interactiveText ?
            <p className="alertbox">{this.state.interactiveText}</p>
            : null
        }
        <div className="hud">
          <div className="hud-column">User: {this.props.userName}</div>
          <div className="hud-column text-center">
            <h1 className="title">Pew Pew</h1>
          </div>
          <div className="hud-column text-center">
            <span className="score">Your Score: {this.state.player.score}</span>
            <button className="close-btn" onClick={() => this.props.closeGame(this.getScores())}>X</button>
          </div>
        </div>
        <div className="container">
          <div className="world-container" style={this.getWorldStyle()}>
            <Scoreboard scores={this.getScores()}/>
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
        </div>
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
  4: {
    rigid: true
  },
  5: {
    rigid: true
  },
  6: {
    rigid: true
  },
  7: {
    rigid: true
  },
  8: {
    rigid: true
  },
  9: {
    rigid: true
  },
  10: {
    rigid: true
  },
  11: {
    rigid: true
  },
  12: {
    rigid: true
  }
};
