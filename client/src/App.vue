<script setup>
import { provide, ref } from 'vue';
import {serverURL, aliveTime} from './config/server.config.js'
import {routes} from './routers/index.js'
import { useRoute } from 'vue-router';

const route = useRoute()
const initialStateOfConnectionInfomation = {
  status:false,
  serverURL:"",
  nickName:"",
  ipaddress:"",
  id:"",
  onlineClientsCount:1,
  onlineClients:[],
}

const lastMessage = ref({
  createdAt:Date.now(),
  sender:"",
  content:""
})
const checkAliveInterval = ref(null)
const connectionInfomation = ref(initialStateOfConnectionInfomation)

let wsc = new WebSocket(serverURL) // wsc means WebSocketClient!

wsc.onopen = (event) => {
  connectionInfomation.value.status = true
  checkAliveInterval.value = setInterval(() => {
    if (wsc.readyState === 1) {
      // wsc.send('ping');
    } else {
      connectionInfomation.value.status = false
      console.log('WebSocket is not alive');
      clearInterval(checkAliveInterval.value);
    }
  }, aliveTime); // Ping every 30 seconds

  connectionInfomation.value = {
    ...connectionInfomation.value,
    serverURL,
  }
  console.log('Connected to',event.target.url)
}

wsc.onclose = (event) =>{
  console.log('Disconnected with code '+ event.code)
  connectionInfomation.value.status = false
  clearInterval(checkAliveInterval.value);
}
wsc.onmessage = (event) => {
  const rawMessage = event.data
  
  if(rawMessage[0] == '/'){
    const commands = rawMessage.substring(1).split(' ', 2)
    switch (commands[0]) {
      case 'update_client_profile':
        const newProfile = JSON.parse(decodeURIComponent(commands[1]))
        connectionInfomation.value = {
          ...connectionInfomation.value,
          nickName:newProfile.nickName,
          id:newProfile.id,
          ipaddress:newProfile.ipaddress
        }
        break;
      case 'update_server_stats':
        const newInfo = JSON.parse(decodeURIComponent(commands[1]))
        connectionInfomation.value.onlineClientsCount = newInfo.onlineClientsCount
        connectionInfomation.value.onlineClients = newInfo.onlineClients
        break
      case 'noti':
        // createNotificationBlock(decodeURIComponent(commands[1]))
        break
      case 'message':
        const message = JSON.parse(decodeURIComponent(commands[1]))
        lastMessage.value = message;
        break
      default:
        break
      }
  }else{
    console.log("Have message:" ,rawMessage);
  }
}

// prevent F5
window.onbeforeunload = function (e) {
    e = e || window.event;
    //old browsers
    if (e) {e.returnValue = 'Are you sure to leave this site? All data in this session will be cleared?';}
    //safari, chrome(chrome ignores text)
    return 'Are you sure to leave this site? All data in this session will be cleared?';
}
if (performance.navigation.type == 1) {
  console.log('Reloaded page');
}

function registerNickName (name){
  try {
    wsc.send('/set nickname '+encodeURIComponent(name))
  } catch (error) {
    throw(error)  
  }
}
function connect(){
  wsc = new WebSocket(serverURL)
  
  wsc.onopen = (event) => {
    connectionInfomation.value.status = true
    checkAliveInterval.value = setInterval(() => {
      if (wsc.readyState === 1) {
        // wsc.send('ping');
      } else {
        connectionInfomation.value.status = false
        console.log('WebSocket is not alive');
        clearInterval(checkAliveInterval.value);
      }
    }, aliveTime); // Ping every 30 seconds

    connectionInfomation.value = {
      ...connectionInfomation.value,
      serverURL,
    }
    console.log('Connected to',event.target.url)
  }

  wsc.onclose = (event) =>{
    console.log('Disconnected with code '+ event.code)
    connectionInfomation.value.status = false
    clearInterval(checkAliveInterval.value);
  }
  wsc.onmessage = (event) => {
    const rawMessage = event.data
    
    if(rawMessage[0] == '/'){
      const commands = rawMessage.substring(1).split(' ', 2)
      switch (commands[0]) {
        case 'update_client_profile':
          const newProfile = JSON.parse(decodeURIComponent(commands[1]))
          connectionInfomation.value = {
            ...connectionInfomation.value,
            nickName:newProfile.nickName,
            id:newProfile.id,
            ipaddress:newProfile.ipaddress
          }
          break;
        case 'update_server_stats':
          const newInfo = JSON.parse(decodeURIComponent(commands[1]))
          connectionInfomation.value.onlineClientsCount = newInfo.onlineClientsCount
        connectionInfomation.value.onlineClients = newInfo.onlineClients
          break
        case 'noti':
          // createNotificationBlock(decodeURIComponent(commands[1]))
          break
        case 'message':
          const message = JSON.parse(decodeURIComponent(commands[1]))
          lastMessage.value = message;
          break
        default:
          break
        }
    }else{
      // console.log("Have message:" ,rawMessage);
    }
  }
}
function disconnect() {
  wsc.send('/exit')
  wsc=null
  Object.assign(connectionInfomation, initialStateOfConnectionInfomation)
}
function sendMessage({msg}){
  wsc.send(msg)
}
provide('lastMessage', lastMessage)
provide('connectionInfomation', connectionInfomation)
provide('serverURL', serverURL)
</script>

<template>
  <div class="appWrapper">
    <div class="nav">
      <router-link v-for="route in routes" :to="route.path">{{ route?.meta?.title }}</router-link>
    </div>
    <div class="main">
    <RouterView v-slot="{Component}" 
      @registerNickName="registerNickName"
      @disconnect="disconnect"
      @connect="connect"
      @sendMessage="sendMessage"
    >
      <Transition name="fade" mode="out-in">
          <component :is="Component"/>
        </Transition>
    </RouterView>
    </div>
  </div>
</template>

<style scoped>
.appWrapper{
  display: flex;
  flex-direction: row;
  height: 100%;
  background-color: rgb(0, 0, 0);
  box-sizing: border-box;
}
.nav{
  width: 120px;
  background-color: #9b3c00;
  padding: 8px 0 8px 8px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: 8px;

  overflow-y: scroll;
}
.nav::-webkit-scrollbar{
  width: 0px;
}
.nav>a{
  padding: 8px 12px;
  color: white;
}
.main{
  background-color: bisque;

  flex-grow: 1;

  overflow-y: scroll;
  min-height: 100vh;
  padding: 8px;
  box-sizing: border-box;

}
.main::-webkit-scrollbar{
  width: 0px;
}
.router-link-exact-active{
  color: #9b3c00 !important;
  background-color: bisque;
}
</style>
