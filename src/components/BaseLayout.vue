<template>
  <div>
    <router-link to="/">Accueil</router-link>
    <slot></slot>
  </div>
</template>

<script>

export default {
  name: 'BaseLayout',
  components: {
  }
}
</script>
