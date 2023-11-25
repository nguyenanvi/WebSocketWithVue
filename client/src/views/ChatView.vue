<template>
  <div class="wrapper">
    <div ref="chatView" class="chat-view"></div>
    <div class="inputWrapper">
      <input @input="updateValue" @keyup.enter="submit" type="text" ref="messageInput" placeholder="Message..."/>
      <button :disabled="!isSubmittable || !isConnected" @click="submit">Submit</button>
    </div>

  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref ,watch } from 'vue';
let connection = new WebSocket('ws://192.168.1.125:8080/');
const message = ref("")
const messageInput = ref(null)
const isSubmittable = ref(false)
const isConnected = ref(false)
const messageValue = ref("")
const chatView = ref(null)

const updateValue = function($event){
  messageValue.value = $event.target.value
}

const createSelfMessageBlock = function (msg){
  let el = document.createElement('p')
  el.innerText = msg;
  el.classList.add('selfMessageBlock');
  const mountedBlock = chatView.value.appendChild(el)
  mountedBlock.scrollIntoView();
}
const createOtherMessageBlock = function (sender, msg){
  let el = document.createElement('div')
  el.classList.add('otherMessageBlock');
  let senderEl = document.createElement('p')
  senderEl.classList.add('sender')
  senderEl.innerText = sender;
  
  let contentEl = document.createElement('p')
  contentEl.classList.add('content')
  contentEl.innerText = msg;
  
  el.appendChild(senderEl)
  el.appendChild(contentEl)
  console.log(el);
  
  const mountedBlock = chatView.value.appendChild(el)
  mountedBlock.scrollIntoView();
}

const createNotificationBlock = function (msg){
  let el = document.createElement('p')
  el.innerText = msg;
  el.classList.add('notificationBlock');

  const mountedBlock = chatView.value.appendChild(el)
  mountedBlock.scrollIntoView();
}

const submit  = function(){
  const msg = messageInput.value.value
  connection.send(msg);
  createSelfMessageBlock(msg);
  messageInput.value.value = ""
};


connection.onopen = (event) =>{
  createNotificationBlock('Connected')
  console.log(connection);
  isConnected.value = true;
  
}
connection.onclose = (event) =>{
  createNotificationBlock('Disconnected')
  isConnected.value = false
}
connection.onmessage = (event) => {
  const rawMessage = event.data;
  console.log("Have message:" ,rawMessage);
  
  if(rawMessage[0] == '/'){
    const commands = rawMessage.substring(1).split(' ', 2)
    switch (commands[0]) {
      case 'noti':
        createNotificationBlock(decodeURIComponent(commands[1]))
        break;
      case 'message':
        const message = JSON.parse(decodeURIComponent(commands[1]))
        createOtherMessageBlock(message.sender, message.content)
        break;
      default:
        break;
      }
  }

}

watch(message, async (newMessage, oldMessage) => {
  // alert(newMessage);
})
watch( messageValue, async(newVal, oldVal)=>{
  isSubmittable.value = (newVal=="")?false:true
})

onMounted(()=>{
  messageInput.value.focus()
});
onUnmounted(()=>{
  connection.send('/exit');
})
</script>

<style>
.wrapper {
  display: flex;
  gap: 8px;
  width: inherit;
  max-height: 100vh;
  flex-direction: column;
  align-items: stretch;
  min-width: inherit;
  overflow: hidden;
}
.inputWrapper{
  width: inherit;
  height: 30px;
  margin-bottom: 8px;
  max-width: inherit;
  display: flex; 
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: stretch;
}
input{
  flex-grow: 1;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
 
  font-family: 'Taviraj';
  font-size: 1em;
  padding: 4px 12px;
}
input::placeholder{
  font-family: 'Taviraj';
  font-size: 1em;
}
input+button{
  font-size: 1em;
  padding: 4px 12px;
  border-radius: 0px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}
@media screen and (max-width:500px) {
  .inputWrapper{
    flex-wrap: wrap;
    height: auto;
    &>*{
      flex-grow:1;
    }
    &>input{
      width:100%;
      border-bottom-left-radius: 0px !important;
      border-top-right-radius: 8px !important;
    }
    &>input+button{
      border-bottom-left-radius: 8px !important;
      border-top-right-radius: 0px !important;
    }
  }
}
.message{
  background-color: aquamarine;
  float: right;
}
.chat-view{
  width: 100%;
  box-sizing: border-box;
  flex-grow: 1;
  background-color: azure;
  border-radius: 16px;
  padding: 8px;
  overflow-y: scroll;

  box-shadow: inset 0 0 10px #888;
}
.chat-view::-webkit-scrollbar{
  width: 0px;
}
.selfMessageBlock{
  max-width: 75%;
  margin: 8px;
  margin-left: auto;
  background-color: var(--primary-color);
  color: var(--primary-color-diff);
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 5px #ddd;
}
.otherMessageBlock{
  max-width: 75%;
  margin: 8px;
  margin-right: auto;
  color: var(--primary-color);
  background-color: #eee;
  padding: 8px;
  padding-top: 2px;
  border-radius: 8px;
  box-shadow: 0 2px 5px #ddd;
  &>.sender{
    font-size: x-small;
    color: gray;
  }

}
.notificationBlock{
  width: 100%;
  text-align: center;
  font-size: 0.8em;
  color: gray;
  font-style: italic;
}
.notificationBlock::before{
  content: "< ";
  font-weight: bolder;
}
.notificationBlock::after{
  content: " >";
  font-weight: bolder;
}
</style>
