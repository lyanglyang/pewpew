import React, {Component} from 'react';

class Bullet extends Component {
  constructor(props, context) {
    super(props, context);
    this.cellSize = 20;
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
    this.setState({text:1, left: (this.props.position.x + 1) * this.cellSize});
    this.intervalHolder = setInterval(this.changePos, 200);
  }

  destroy() {
    clearInterval(this.intervalHolder)
  }

  componentWillReceiveProps() {
    this.fire();
  }

  changePos() {
    let newText = this.state.text + 1;
    if (newText === 4) {
      this.destroy();
    }
    this.setState({text: newText, left: this.state.left + this.cellSize})
  }

  getCellStyle() {
    return {
      left: this.state.left,
      top: this.cellSize * this.props.position.y
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
