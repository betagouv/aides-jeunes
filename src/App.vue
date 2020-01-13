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
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;

  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  color: black;
  text-decoration: none;
}

body, h1, h2, h3 {
  font-family: "Open Sans","Helvetica Neue",Helvetica,Arial,sans-serif;
}

h1, h2, h3, {
  font-weight: 300;
}
</style>
