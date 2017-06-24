import React, {Component} from 'react';
import GLOBAL from '../constants';

class Bullet extends Component {
  constructor(props, context) {
    super(props, context);
    this.intervalHolder = '';
    this.state = {
      text: 1
    };

    this.changePos = this.changePos.bind(this);
    this.getCellStyle = this.getCellStyle.bind(this);
    this.fire = this.fire.bind(this);
    this.destroy = this.destroy.bind(this);
  }

  componentDidMount() {
    this.fire()
  }

  fire() {
    this.setState({text:1, left: (this.props.position.x + 1) * GLOBAL.CELL_SIZE});
    this.intervalHolder = setInterval(this.changePos, 200);
  }

  destroy() {
    clearInterval(this.intervalHolder);
    this.props.killBullet();
  }

  componentWillReceiveProps() {
    this.fire();
  }

  changePos() {
    let newText = this.state.text + 1;
    if (newText === 4) {
      this.destroy();
    }
    this.setState({text: newText, left: this.state.left + GLOBAL.CELL_SIZE})
  }

  getCellStyle() {
    return {
      left: this.state.left,
      top: GLOBAL.CELL_SIZE * this.props.position.y
    }
  }

  render() {
    console.log(this.getCellStyle())
    return (
      <div className="frog" style={this.getCellStyle()}>
        B{this.state.text}
      </div>)
  }
}

export default Bullet;
