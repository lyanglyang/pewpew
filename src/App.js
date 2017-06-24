import React, {Component} from 'react';

import backand from '@backand/vanilla-sdk'
import World from './world';
import axios from 'axios'
//constants
import GLOBAL from './constants';

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

const ANONYMOUS_TOKEN = 'fb44c3c7-d0ca-40a6-81d1-5bd6484af3be';
//backand code
backand.init({
  appName: 'pewpew',
  anonymousToken: ANONYMOUS_TOKEN,
  runSocket: true,
});

axios.defaults.headers.common['AnonymousToken'] = ANONYMOUS_TOKEN;

//send request to backand
axios.get('https://api.backand.com/1/function/general/game');

backand.on('items_updated', function (data) {
  console.log('items_updated');
  console.log(data);
});

class App extends Component {

    render() {
        return (
            <div>
                User: {this.props.userName}
                <World worldMap={GLOBAL.GAME_WORLD}/>
            </div>
        );
    }
}

export default App;
