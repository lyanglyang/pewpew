import React from 'react';
import GLOBAL from '../constants';
import { Line } from 'rc-progress';

export default class Frog extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
    this.movingDirection = 1;
    this.punchCooldownActive = false;
    this.setKeyBindings = this.setKeyBindings.bind(this);
    this.pewpew = this.pewpew.bind(this);
  }

  componentDidMount() {
    this.setKeyBindings();
  }

  pewpew() {
    if(this.punchCooldownActive) {
      return false;
    }
    let swordDirections = {
      1: {left: -1, top: 0},
      2: {left: 1, top: 0},
      3: {left: 0, top: -1},
      4: {left: 0, top: 1}
    };
    let swordDirection = swordDirections[this.movingDirection];
    this.props.pewpew({
      x: this.props.player.position.x + (swordDirection['left'] / 4),
      y: this.props.player.position.y + (swordDirection['top'] / 4),
      swordDirection: swordDirection
    });
    this.punchCooldownActive = true;
    setTimeout(()=> {
      this.punchCooldownActive = false;
    },250);
  }

  setKeyBindings() {
    document.onkeyup = (e) => {
      e = e || window.event;
      let playerPosition = Object.assign({}, this.props.player.position);
      switch (e.which || e.keyCode) {
        case 37:
          playerPosition.x -= 0.25;
          this.movingDirection = 1;
          break;

        case 39:
          playerPosition.x += 0.25;
          this.movingDirection = 2;
          break;

        case 38:
          playerPosition.y -= 0.25;
          this.movingDirection = 3;
          break;

        case 40:
          playerPosition.y += 0.25;
          this.movingDirection = 4;
          break;

        case 32:
          this.pewpew();
          return;

        default:
          return;
      }
      this.props.setPlayerPosition(playerPosition);
    }
  }

  getCellStyle = () => {
    return {
      left: GLOBAL.CELL_SIZE * this.props.player.relativePosition.x,
      top: GLOBAL.CELL_SIZE * this.props.player.relativePosition.y,
      height: (GLOBAL.CELL_SIZE / 4),
      width: (GLOBAL.CELL_SIZE / 4)
    }
  };

  getSwordActionStyle = () => {
    let swordDirection = this.props.player.swordAction.swordDirection;
    return {
      height: (GLOBAL.CELL_SIZE / 4),
      width: (GLOBAL.CELL_SIZE / 4),
      left: (swordDirection['left']) * (GLOBAL.CELL_SIZE / 4),
      top: (swordDirection['top']) * (GLOBAL.CELL_SIZE / 4),
    }
  };

  checkColor = ()=>{
    if(this.props.player.health > 50)
      return '#0f0';
    else
      return '#f00';
  };


  render() {
    return (
        <div className="frog" style={this.getCellStyle()}>
          <span className="player-name">{this.props.player.name}</span>
          <Line className="health-bar" percent={this.props.player.health} strokeWidth="4" strokeColor={this.checkColor()} />
          {
            (this.props.player.swordAction.active) ?
              <div className="sword-action-wrapper">
                <div className="sword-action" style={this.getSwordActionStyle()}>
                </div>
              </div>
              : null
          }
        </div>
    )
  }
}
