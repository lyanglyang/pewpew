import React from 'react';

export default class Login extends React.Component {

  handleLogin = (e)=>{

    //callApi({
      //name: this.refs.name.value
    //});
    let name = this.refs.name.value;
    if(this.refs.name.value=== ""){
      alert("name is empty")
    }
    else{
      this.props.setSession(name);

    }
  };

  render() {
    return (
      <div className="login-containter">
        <div className="title">
          Pew Pew
        </div>
        <input type="text" ref="name" placeholder="Name"/>
        <button type="button" onClick={this.handleLogin} className="login-btn">Login</button>
      </div>)
  }
}
