import React, { Component } from 'react';
import TileMap from './tile-map';

const ERRORS = {
  AUDIOPERMISSIONDENIED: "PermissionDeniedError"
};

const MESSAGES = {
  NEEDSAUDIOPERMISSION: "You need to provide audio access for this game to work."
};

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
    if(voiceLevel>30){
      console.log(voiceLevel);
    }
  }, 200);

  // Connect it to destination to hear yourself
  // or any other node for processing!
  // mediaStreamSource.connect(audioContext.destination);


}).catch(function (err) {
  console.log(err);
  if (err.name === ERRORS.AUDIOPERMISSIONDENIED) {
    alert(MESSAGES.NEEDSAUDIOPERMISSION);
  }
});

class App extends Component {
  render() {
    return (
      <TileMap/>
    );
  }
}

export default App;
