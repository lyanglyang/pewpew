import io from 'socket.io-client';

let socket = io('http://localhost:5000');

let server = {

  updatePlayer: function (_player) {
    console.log(_player);
    socket.emit('player-update');
  },

  hitOpponent: function (_player) {
    console.log(_player);
    socket.emit('player-hit');
  },

  useSword: function (_player) {
    console.log(_player);
    socket.emit('player-use-sword');
  }
};

export default server;
