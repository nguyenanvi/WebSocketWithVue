import WebSocket,{ WebSocketServer } from 'ws'
import { createNewUID } from './helper/index.js'
import 'dotenv/config'
const wss = new WebSocketServer({ 
  port:process.env.SERVER_PORT || 8080,
  host:process.env.HOST || 'localhost'
})

wss.on('connection', function connection(ws, req) {
  // wss.clients.forEach(function each(client) {
  //   if (client.readyState === WebSocket.OPEN) {
  //     //Do your code here for all clients
  //   }
  // });
  function sendUpdateProfile(){
    const clientProfile = {
      ipaddress: ws.ipaddress,
      nickName:ws.nickName,
      id: ws.id
    }
    ws.send('/update_client_profile '+encodeURIComponent(JSON.stringify(clientProfile)))
  }

  ws.isAlive = true;
  ws.on('pong', function () {
    // it means The connection is still alive
    ws.isAlive = true;
    if(ws.isAlive){
      // By the way, notice to the client knows server's stats: 
      ws.send('/update_server_stats '+encodeURIComponent(JSON.stringify({
        onlineClientsCount:wss.clients.size,
        onlineClients: Array.from(wss.clients)
      })))
    }
  })

  ws.on('message', async function message(data) {
    const msg = data.toString()
    if(msg[0] == '/'){
      // The message now know as a sys call
      const commands = msg.substring(1).split(' ')
      switch (commands[0]) {
        case 'greeting':
          ws.send('Hello, '+(commands[1]?commands[1]:""))
          break
        case 'exit':
          ws.send('Closing connection...')
          ws.close()
          break
        case 'set':
          ws.nickName = decodeURIComponent(commands[2]);
          sendUpdateProfile()
          break
        default:
          ws.send('Unknown command \''+commands[0]+'\'. Type \'help\' for more informations.', )
          break
        }
    } else {
      // Send Normal message
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send('/message '+encodeURIComponent(JSON.stringify({
            createdAt:Date.now(),
            sender: ws.id,
            content: msg
          })));
        }
      });
    }
    console.log('%s ON_MESS %s\t%s', Date.now().toString().substring(8,12),ws.id, msg);
  });

  ws.on('error', function(error){
    console.log(error)
  })

  ws.on('close', function (data){
    // Send new OnlineClients list for others
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
          // client.send('/noti '+encodeURIComponent(`${req.socket.remoteAddress} has leaved the chat`));
      }
    })
    clearInterval(interval)
    console.log("%s ON_CLS  %s\t%d active",Date.now().toString().substring(8, 12), ws.id, wss.clients.size)
  })
  
  // first time connecting function block ///////////
  const newId = createNewUID(Date.now())
  ws.id = newId
  ws.nickName = "Client_"+newId
  ws.ipaddress = req.socket.remoteAddress

  sendUpdateProfile()

  console.log("%s ON_OPEN %s\t%d active",Date.now().toString().substring(8, 12),ws.id, wss.clients.size)
  const interval = setInterval(function ping() {
      if (ws.isAlive === false) return ws.terminate();
      ws.startPing=Date.now()
      ws.isAlive = false
      ws.ping()
      console.log("%s ON_PING %s\t%d active",Date.now().toString().substring(8, 12), ws.id, wss.clients.size)
  }, process.env.ALIVE_TIME)
  
})
console.log("Server is listening on URL ws://%s:%s",wss.options.host, wss.options.port)
console.log("Copy this URL and set Client's config (/Client/src/config/server.config.js)");