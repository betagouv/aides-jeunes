<template>
  <div>
    <nav>
      <router-link v-bind:to="link">{{ label }}</router-link>
    </nav>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "iFrameLayout",
  computed: {
    label: function () {
      return this.$store.state.iframeOrigin ? "Précédent" : "À propos"
    },
    link: function () {
      return this.$store.state.iframeOrigin || "/a-propos-integre"
    },
  },
}
</script>

<style scoped lang="scss">
nav {
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

nav a {
  margin: 1em;
}
</style>
