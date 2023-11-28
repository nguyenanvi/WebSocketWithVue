<template>
  <div class="wrapper">
    <h1>Settings</h1>
    <form v-if="conn.status">
      <div class="frm-grp">
        <label>
          Server domain: {{ serverURL }}
        </label>
      </div>
      <div class="frm-grp">
        <label>
          Current nickName: <strong>{{ conn.nickName }}</strong>
        </label>
      </div>
      <div class="frm-grp">
        <label>
          Current ip: <strong>{{ conn.ipaddress }}</strong>
        </label>
      </div>
      <div class="frm-grp">
        <label>
          Online clients: <strong>{{ conn.onlineClientsCount }}</strong>
        </label>
      </div>
    </form>
    <form v-if="conn.status" >
      <div class="frm-grp">
        <label>
          Your nickname:
        </label>
        <input type="text" ref="nickName" @input="verifyNickName"/>
      </div>
      <div class="frm-grp">
        <button :disabled="!isSubmittable" @click.prevent="emit('registerNickName',[nickName.value])">Register Name</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, defineEmits, inject } from 'vue'

const nickName = ref(null)
const isSubmittable = ref(false)

const conn = inject('connectionInfomation')
const serverURL = inject('serverURL')

const emit = defineEmits(['disconnect', 'registerNickName']);

function verifyNickName($event){
  isSubmittable.value = ($event.target.value!=="") && ($event.target.value !== conn.nickName)
}

</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-items: center;
  width: 100%;
  height: 100%;
}
form{
  width: 300px;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 0 5px #999;
}
form  > .frm-grp{
  padding-block: 8px;
  overflow: hidden;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  gap: 8px;
}
form  > .frm-grp > input{
  width: 160px;
  font-size: medium;
}
form > .frm-grp {
  max-width: inherit;
}
form > .frm-grp > button{
  width: 100%;
}
@media screen and (max-width:600px) {
  .wrapper {
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-items: center;
    width: 100%;
    height: 100%;
  }
  form{
    width: 100%;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 0 5px #999;
  }
  form  > .frm-grp{
    padding-block: 8px;
    overflow: hidden;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    box-sizing: border-box;
    gap: 8px;
  }
  form  > .frm-grp > input{
    width: auto;
  }
  form > .frm-grp {
    max-width: 100%;
  }
  form > .frm-grp > button{
    width: 100%;
  }
}
</style>
