import React, {Component} from 'react';

import World from './components/world';
//constants
import GLOBAL from './constants';


class App extends Component {

  render() {
    return (
        <World worldMap={GLOBAL.GAME_WORLD} {...this.props}/>
    );
  }
}

export default App;
