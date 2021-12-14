<template>
  <div>
    <nav>
      <router-link :to="link">
        {{ label }}
      </router-link>
    </nav>
    <slot />
  </div>
</template>

<script>
export default {
  name: "IFrameLayout",
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
