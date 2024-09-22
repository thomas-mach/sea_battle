<template>
  <div id="app">
    <Header />
    <Main />
    <Footer />
  </div>
</template>
<script>
import Header from './components/header.vue';
import Main from './components/main.vue'
import Footer from './components/footer.vue'

export default {
  name: 'App',
  components: {
    Header,
    Main,
    Footer,
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
