import React from 'react';
import Controls from './controls';

export default function controlsHOC(WrappedComponent){
  return class controls extends React.Component{
    constructor(){
      super();
      this.state = {
        controls: false
      }
    }

    handleControls = () =>{
      this.setState({controls: !this.state.controls})
    };


    render(){
      return this.state.controls? <Controls goBack={this.handleControls}/> : <WrappedComponent goToControls={this.handleControls} {...this.props}/>
    }
  }
}
