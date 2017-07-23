import io from 'socket.io-client';

let socket = io('http://localhost:5000');

let server = {

  updatePlayer: function (_player) {
    console.log(_player);
    socket.emit('player-update', JSON.stringify(_player));
  },

  hitOpponent: function (_player) {
    console.log(_player);
    socket.emit('player-hit', JSON.stringify(_player));
  },

  useSword: function (_player) {
    console.log(_player);
    socket.emit('player-use-sword', JSON.stringify(_player));
  }
};

export default server;
