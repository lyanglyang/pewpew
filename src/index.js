import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Login from './Login';
import GameOver from './GameOver';
import _ from 'lodash';
import backand from './common/Backand';

import registerServiceWorker from './registerServiceWorker';
import './index.css';

class Main extends React.Component {

  constructor(){
    super();
    this.state = {
      gameOver: false,
      response: {},
    }
  }

  setSession = (response)=>{
    this.setState({response: response, gameOver: false})
  };

  clearSession = () =>{
    backand.signout().then(()=> console.log('nothing'));
    this.setState({response: {}, gameOver: false})
  };

  closeGame = ()=>{
    this.setState({gameOver: true});
  };

  render() {
    if( this.state.response && !this.state.response.access_token ){
      return <Login setSession={this.setSession}/>
    }
    else if (this.state.gameOver){
      return <GameOver clearSession={this.clearSession} toggleGame={()=> this.setState({gameOver: !this.state.gameOver})}/>
    }
    else {
      return <App response={this.state.response}
                  userName={this.state.response && this.state.response.firstName}
                  closeGame={this.closeGame}
      />
    }
  }
}

ReactDOM.render(<Main/>, document.getElementById('root'));

registerServiceWorker();
