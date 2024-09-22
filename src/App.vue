<template>
  <div id="app">
    <HeaderComponent />
    <MainComponent />
    <FooterComponent />
  </div>
</template>
<script>
import HeaderComponent from './components/headerComponent.vue';
import MainComponent from './components/mainComponent.vue'
import FooterComponent from './components/footerComponent.vue'

export default {
  name: 'App',
  components: {
    HeaderComponent,
    MainComponent,
    FooterComponent,
  }
}

</script>

<style>
#app {
  width: 100vw;
  height: 100vh;
  display: felx;
  flex-direction: column;
}
</style>
