import React from 'react';

//hoc
import controlsHOC from '../common/controlsHOC';

class Login extends React.Component {

  constructor(){
    super();
    this.state = {
      defaultName: 'Player 1'
    }
  }

  handleLogin = (e)=>{
    e.preventDefault();
    //callApi({
      //name: this.refs.name.value
    //});
    let name = this.state.defaultName;
    if(name=== ""){
      alert("name is empty")
    }
    else{
      this.connectBackand(name);
    }
  };

  handleChange = (e)=>{
    this.setState({defaultName: e.target.value})
  };

  connectBackand = (name) => {
    this.props.setSession({firstName: name, access_token: 'test123'});
    // const ANONYMOUS_TOKEN = 'fb44c3c7-d0ca-40a6-81d1-5bd6484af3be';
    // backand.signup(`${name}`, "", `user+${new Date().getTime()}@reactriot.com`, "test123", "test123", {})
    //   .then(res => {
    //     this.props.setSession(res.data);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  };

  render() {
    return (
      <div className="login-container">
        <h1 className="title">
          Pew Pew
        </h1>
        <form onSubmit={this.handleLogin}>
          <div className="form-row">
          <input autoFocus={true} type="text" placeholder="Name" value={this.state.defaultName} onChange={this.handleChange} /></div>
          <div className="form-row"><button type="submit" className="login-btn">Play</button></div>
          <div className="form-row"><button type="button" onClick={this.props.goToControls} className="controls-btn">Controls</button></div>
          <div className="form-row"><button type="button" onClick={this.props.goToAboutUs} className="controls-btn">About Us</button></div>
        </form>
      </div>)
  }
}

export default controlsHOC(Login);
