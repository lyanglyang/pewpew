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
      this.props.setSession(name);

    }
  };

  handleChange = (e)=>{
    this.setState({defaultName: e.target.value})
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
