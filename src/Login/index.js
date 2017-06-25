import React from 'react';

//hoc
import controlsHOC from '../common/controlsHOC';

// backand
import backand from '@backand/vanilla-sdk';
import axios from 'axios';

class Login extends React.Component {

  constructor(){
    super();
    this.state = {
      defaultName: 'Player 1'
    }
  }
  handleLogin = async (e)=>{

    e.preventDefault();
    //callApi({
      //name: this.refs.name.value
    //});
    let name = this.state.defaultName;
    if(name=== ""){
      alert("name is empty")
    }
    else{
      await this.connectBackand(name);
      this.setBackandEvents();
      this.props.setSession();
    }
  };

  setBackandEvents = () => {
    backand.on('items_updated', function (data) {
      console.log('items_updated');
      console.log(data);
      debugger
    });
    setInterval(() => {
      axios.get('https://api.backand.com/1/function/general/game');
    }, 1000)
  };

  handleChange = (e)=>{
    this.setState({defaultName: e.target.value})
  };

  connectBackand = (name) => {
    const ANONYMOUS_TOKEN = 'fb44c3c7-d0ca-40a6-81d1-5bd6484af3be';
    backand.init({
      appName: 'pewpew',
      signUpToken: "cf706c34-ce4b-45f1-80c0-2a517fef995b",
      anonymousToken: ANONYMOUS_TOKEN,
      runSocket: true,
    });
    backand.signup(`${name}`, "", `user+${new Date().getTime()}@reactriot.com`, "test123", "test123", {})
      .then(res => {
        localStorage.setItem('BACKAND_RESPONSE',JSON.stringify(res.data));
      })
      .catch(err => {
        console.log(err);
      });
    axios.defaults.headers.common['AnonymousToken'] = ANONYMOUS_TOKEN;
  };

  render() {
    return (
      <div className="login-containter">
        <div className="title">
          Pew Pew
        </div>
        <form onSubmit={this.handleLogin}>
          <input autoFocus={true} type="text" placeholder="Name" value={this.state.defaultName} onChange={this.handleChange} />
          <button type="button" onClick={this.props.goToControls} className="controls-btn">Controls</button>
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>)
  }
}

export default controlsHOC(Login);
