<script setup>
</script>

<template>
  <div class="appWrapper">
    <div class="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/chat">Chat</router-link>
    </div>
    <div class="main">
    <RouterView v-slot="{Component}">
      <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
    </RouterView>
    </div>
  </div>
</template>

<style scoped>
.appWrapper{
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0);
}
.nav{
  width: 200px;
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

  overflow-y: scroll;
  width: 100%;
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
