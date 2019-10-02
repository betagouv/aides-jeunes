<template>
  <BaseLayout id="app">
    <router-view/>
  </BaseLayout>
</template>

<script>
  
import BaseLayout from '@/components/BaseLayout.vue'

export default {
  name: 'app',
  components: {
    BaseLayout,
  }
}
</script>

<style lang="scss">

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-image: url('./../../mes-aides-ui/app/img/homepage/homepage-5760.png');
  background-attachment: fixed;
  background-position: top center;
  background-size: 100%;
  background-repeat: no-repeat;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

a {
  color: #008cba;
  text-decoration: none;
}
</style>
