var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const gameActions = {
  PLAYER_UPDATE: 'player-update',
  PLAYER_HIT: 'player-hit',
  PLAYER_USE_SWORD: 'player-use-sword',

};

const { PLAYER_UPDATE, PLAYER_HIT, PLAYER_USE_SWORD } = gameActions;

app.get('/', function (req, res) {
  res.sendfile('index.html');
});

function playerUpdateHandler(player) {
  io.emit(PLAYER_UPDATE, player);
}

function playerHitHandler(player) {
  io.emit(PLAYER_HIT, player);
}

function playerUseSwordHandler(player) {
  io.emit(PLAYER_USE_SWORD, player);
}

//Whenever someone connects this gets executed
io.on('connection', function (socket) {

  socket.on(PLAYER_UPDATE, playerUpdateHandler);
  socket.on(PLAYER_HIT, playerHitHandler);
  socket.on(PLAYER_USE_SWORD, playerUseSwordHandler);

  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });

});

http.listen(8000, function () {
  console.log('listening on *:8000');
});
