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

  // Create an AudioNode from the stream
  var mediaStreamSource = audioContext.createMediaStreamSource(stream);

  // Connect it to destination to hear yourself
  // or any other node for processing!
  mediaStreamSource.connect(audioContext.destination);


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
