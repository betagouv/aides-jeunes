<template>
  <div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "BaseLayout",
  components: {},
  created() {
    this.$router.isReady().then(() => {
      if (this.$route.query.debug === "parcours") {
        this.$store.dispatch("setDebug", true)
      }
    })
  },
}
</script>
