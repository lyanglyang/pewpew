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
    let response = {};
    if (!_.isEmpty(localStorage.getItem('BACKAND_RESPONSE'))){
      response = JSON.parse(localStorage.getItem('BACKAND_RESPONSE'))
    }
    this.state = {
      gameOver: false,
      response: response,
    }
  }

  setSession = ()=>{
    let response = JSON.parse(localStorage.getItem('BACKAND_RESPONSE'));
    this.setState({response: response, gameOver: false})
  };

  clearSession = () =>{
    backand.signout().then(()=> console.log('nothing'));
    localStorage.setItem('BACKAND_RESPONSE', JSON.stringify({}));
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
