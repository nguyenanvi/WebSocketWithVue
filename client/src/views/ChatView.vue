<template ref="chatView">
  <div class="wrapper" v-show="connectionInfomation.status">
    <div class="contacts-list">
      <h3 class="label">🟢 {{ (connectionInfomation.onlineClientsCount) }} Online </h3>
      <div class="contact-item" v-for="item in connectionInfomation.onlineClients" :key="item.id">
        <div class="avt">
          <img src="https://th.bing.com/th/id/R.2c6e94aaf20d66610132b533ae100324?rik=3%2fI3gYD68HajrA&pid=ImgRaw&r=0" alt="">
        </div>
        <div class="name">
          {{ item.nickName }}{{ (item.id === connectionInfomation.id)?("(Me)"):("") }}
        </div>
      </div>
    </div>
    <div class="chatWrapper">
      <div ref="chatView" class="chat-view"></div>
      <div class="inputWrapper">
        <!-- <textarea rows="1" @input="verifyMessage" @keyup.enter="submit" type="text" ref="messageInput" placeholder="Message..."/> -->
        <textarea rows="1" @input="verifyMessage" type="text" ref="messageInput" placeholder="Message..."/>
        <button :disabled="!isSubmittable" @click="submit">Submit</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref ,watch, defineEmits, inject } from 'vue';
const messageInput = ref(null)
const isSubmittable = ref(false)
const chatView = ref(null)
const message = ref("")

const emit = defineEmits(['sendMessage'])

const connectionInfomation = inject('connectionInfomation')
const lastMessage = inject('lastMessage')

const verifyMessage = function($event){
  message.value = $event.target.value
  if(message.value === "")
    isSubmittable.value = false
  else
    isSubmittable.value = true
}

// const createSelfMessageBlock = function (msg){
//   let el = document.createElement('p')
//   el.innerText = msg;
//   el.classList.add('selfMessageBlock');
//   const mountedBlock = chatView.value.appendChild(el)
//   mountedBlock.scrollIntoView();
// }

function toHour(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes;
}

const createMessageBlock = function (message){
  let el = document.createElement('div')
  el.classList.add('messageBlock')
  if(message.sender === connectionInfomation.value.id){
    el.classList.add('selfMessageBlock');
  } else {
    el.classList.add('otherMessageBlock');
  }

  let senderEl = document.createElement('p')
  senderEl.classList.add('sender')
  senderEl.innerText = connectionInfomation.value.onlineClients.filter(item=>(item.id===message.sender))[0].nickName;
  
  let contentEl = document.createElement('p')
  contentEl.classList.add('content')
  contentEl.innerText = message.content;

  let createdAtEl = document.createElement('p')
  createdAtEl.classList.add('time')
  createdAtEl.innerText = toHour(new Date(message.createdAt));
  
  el.appendChild(senderEl)
  el.appendChild(contentEl)
  el.appendChild(createdAtEl)
  
  const mountedBlock = chatView.value.appendChild(el)
  mountedBlock.scrollIntoView();
}

const submit  = function(){
  const msg = message.value
  emit('sendMessage',{msg})
  messageInput.value.value = ""
};
watch(lastMessage, async (newMessage, oldMessage) => {
  createMessageBlock(newMessage);
})

onMounted(()=>{
  messageInput.value.focus()
});

</script>

<style scoped>
.wrapper {
  display: flex;
  gap: 8px;
  max-height: 100vh;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  overflow: hidden;
  box-sizing: border-box;
}
.contacts-list{
  height: 100%;
  min-width: 56px;
  width: 56px;
  overflow: hidden;
  transition: width .75s ease-out;
}
.contacts-list:hover,
.contacts-list.expanded{
  width: 250px;
}
.contacts-list > .label{
  transition: transform .75s ease-out;
  transform: translateX(100%);
  height: 1em;
  text-wrap: nowrap;

  padding-inline: 8px;
}
.contacts-list:hover > .label,
.contacts-list.expanded .label{
  transform: translateX(0);
}
.contacts-list > .contact-item{
  height: 48px;
  background-color: beige;
  padding: 4px;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover{
    background-color: var(--primary-color);
    color: var(--primary-color-diff);
  }
}
.contacts-list > .contact-item > .avt{
  height: inherit;
}
.contacts-list > .contact-item > .avt > img{
  background-color: white;
  border-radius: 50%;
  height: inherit; 
  aspect-ratio: 1;
}
.contacts-list > .contact-item > .name{
  font-weight: 600;
  text-wrap: nowrap ;
}
.chatWrapper{
  height: 100%;
  display: flex;
  flex-direction: column;
  
  align-items: stretch;

  gap: 8px;
  flex-grow: 1;
}
.chat-view{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: azure;
  border-radius: 16px;
  padding: 8px;
  overflow-y: scroll;

  box-shadow: inset 0 0 10px #888;
}
.chat-view::-webkit-scrollbar{
  width: 0px;
}
.inputWrapper{
  width: inherit;
  height: 50px;
  margin-bottom: 8px;
  max-width: inherit;
  display: flex; 
  flex-wrap: nowrap;
  justify-content: space-between;
  flex-grow: 1;
}
textarea{
  flex-grow: 1;
  resize: none;

  min-height: 50px;
  max-height: 110px;

  font-size: 1em;
  max-lines: 5;
  line-height: 21px;
  box-sizing: border-box;
  
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
 
  padding: 4px 12px;
}
textarea::placeholder{
  font-size: 1em;
}
textarea::-webkit-scrollbar{
  width: 0px;
}
textarea+button{
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
    &>textarea{
      width:100%;
      border-bottom-left-radius: 0px !important;
      border-top-right-radius: 8px !important;
    }
    &>textarea+button{
      border-bottom-left-radius: 8px !important;
      border-top-right-radius: 0px !important;
    }
  }
}
</style>
<style>
.message{
  background-color: aquamarine;
  float: right;
}
.messageBlock{
  max-width: 300px;
  margin: 8px;
  padding: 8px;
  padding-top: 2px;
  border-radius: 8px;
  box-shadow: 0 2px 5px #ddd;

  display: flex;
  flex-direction: column;
}
.selfMessageBlock{
  margin-left: auto;
  background-color: var(--primary-color);
  color: var(--primary-color-diff);
  &>.sender, &>.time{
    font-size: x-small;
    color: lightgray;
  }
}
.otherMessageBlock{
  margin-right: auto;
  color: var(--primary-color);
  background-color: #eee;
  &>.sender, &>.time{
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
