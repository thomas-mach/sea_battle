<template>
  <div id="app">
    <Header />
    <Main />
    <Footer />
  </div>
</template>
<script>
import Header from './components/Header.vue';
import Main from './components/Main.vue'
import Footer from './components/Footer.vue'

export default {
  components: {
    Header,
    Main,
    Footer
  }
}

</script>

<style>
#app {
  width: 100vw;
  height: 100%;
  display: felx;
  flex-direction: column;
}
</style>
