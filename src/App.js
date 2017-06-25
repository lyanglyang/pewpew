import React, {Component} from 'react';

import World from './world';
//constants
import GLOBAL from './constants';
import ERRORS from './constants/errors';
import MESSAGES from './constants/messages';

let constraints = {audio: true};

var getAudioPermission = navigator.mediaDevices.getUserMedia(constraints);

getAudioPermission.then(function (stream) {
  /* use the stream */
  console.log('success');

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  var audioContext = new AudioContext();

  var inputPoint = audioContext.createGain()

  // Create an AudioNode from the stream
  var mediaStreamSource = audioContext.createMediaStreamSource(stream);

  mediaStreamSource.connect(inputPoint);

  var analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 2048;
  inputPoint.connect(analyserNode);

  setInterval(function () {
    var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);
    analyserNode.getByteFrequencyData(freqByteData);

    var sum = 0;
    for (var i = 0; i < freqByteData.length; i++) {
      sum += freqByteData[i];
    }

    let voiceLevel = sum / freqByteData.length;
    if (voiceLevel > 30) {
      // console.log(voiceLevel);
    }
  }, 200);

  // Connect it to destination to hear yourself
  // or any other node for processing!
  // mediaStreamSource.connect(audioContext.destination);


}).catch(function (err) {
  console.log(err);
  if (err.name === ERRORS.AUDIO_PERMISSION_DENIED) {
    alert(MESSAGES.NEEDS_AUDIO_PERMISSION);
  }
});

class App extends Component {

  render() {
    return (
      <div>
        <div className="container">
          <div className="hud">
            <div className="hud-column">User: {this.props.userName}</div>
            <div className="hud-column text-center">
              <h1 className="title">Pew Pew</h1>
            </div>
            <div className="hud-column text-center">
              <span className="score">Your Score: 0</span>
              <button className="close-btn" onClick={this.props.closeGame}>X</button>
            </div>
          </div>
        </div>
        <div className="container">
          <World worldMap={GLOBAL.GAME_WORLD} closeGame={this.props.closeGame}/>
        </div>
      </div>
    );
  }
}

export default App;
