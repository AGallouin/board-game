import WebSocket from 'ws';

const ws = new WebSocket('ws://http://127.0.0.1:8000/tictactoe/41/');

ws.on('error', console.error);

ws.on('open', function open() {
  ws.send('something');
});

ws.on('message', function message(data) {
  console.log('received: %s', data);
});