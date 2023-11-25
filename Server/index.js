import WebSocket,{ WebSocketServer } from 'ws';

import 'dotenv/config';

const PORT = process.env.SERVER_PORT || 8080;

const wss = new WebSocketServer({ 
  port:PORT
});

wss.on('connection', function connection(ws, req) {

  ws.on('message', async function message(data) {
    const msg = data.toString()
    if(msg[0] == '/'){
      const commands = msg.substring(1).split(' ');
      switch (commands[0]) {
        case 'greeting':
          ws.send('Hello, '+(commands[1]?commands[1]:""))
          break;
        case 'exit':
          ws.send('Closing connection...')
          ws.close()
          break;
        default:
          ws.send('Unknown command. Type \'help\' for more informations.')
          break;
        }
    } else {
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          const sender = req.socket.remoteAddress;
          client.send('/message '+encodeURIComponent(JSON.stringify({
            sender,
            content: msg
          })));
        }
      });
    }
    console.log('%d - received from %s - %s', Date.now(), req.socket.remoteAddress, msg);
  });

  ws.on('error', console.error);

  ws.on('close', function (data){
    console.log("Disconnected: %s", req.socket.remoteAddress);
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send('/noti '+encodeURIComponent(`${req.socket.remoteAddress} has leaved the chat`));
      }
    });
  })
  
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send('/noti '+encodeURIComponent(`${req.socket.remoteAddress} has joined`));
    }
  });
  console.log("Connected: ",req.socket.remoteAddress);
});

console.log("Server is listening on port %s", PORT);