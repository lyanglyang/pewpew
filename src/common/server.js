import io from 'socket.io-client';

let socket = io('http://localhost:5000');

//remove this global variable; just for development debugging
window.socket = socket;

socket.on("joined-successfully", (data) => {
  localStorage.setItem('user', JSON.stringify(data));
});

let server = {

  signUp: function (name) {
    socket.emit('signup', name);
  },

  updatePlayer: function (_player) {
    socket.emit('player-update', JSON.stringify(_player));
  },

  hitOpponent: function (_player) {
    // console.log(_player);
    socket.emit('player-hit', JSON.stringify(_player));
  },

  useSword: function (_player) {
    socket.emit('player-use-sword', JSON.stringify(_player));
  },

  handlePlayerUseSword: function (eventHandler) {
    socket.on('player-use-sword', eventHandler)
  },

  handlePlayerUpdate: function (eventHandler) {
    socket.on('player-update', eventHandler)
  },

  handlePlayerHit: function (eventHandler) {
    socket.on('player-hit', eventHandler)
  },

};

export default server;
