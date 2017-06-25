import React from 'react';
import Controls from './controls';
import AboutUs from './aboutUs';

export default function controlsHOC(WrappedComponent){
  return class controls extends React.Component{
    constructor(){
      super();
      this.state = {
        controls: false,
        aboutUs: false,
      }
    }

    handleControls = () =>{
      this.setState({controls: !this.state.controls})
    };

    handleAboutUs = () =>{
      this.setState({aboutUs: !this.state.aboutUs})
    };

    render(){

      if(this.state.controls)
        return <Controls goBack={this.handleControls}/>;

      if (this.state.aboutUs)
        return <AboutUs goBack={this.handleAboutUs}/>;

      return <WrappedComponent goToControls={this.handleControls} goToAboutUs={this.handleAboutUs} {...this.props}/>
    }
  }
}
