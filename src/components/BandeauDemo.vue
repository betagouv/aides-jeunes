<template>
  <div class="bandeau-demo-wrapper" v-if="afficheBandeau">
    <a class="bandeau-demo" :href="link"> Démo </a>
  </div>
</template>

<script>
export default {
  name: "BandeauDemo",
  computed: {
    afficheBandeau() {
      return process.env.VUE_APP_DEPLOY
    },
    link() {
      const PRNumber = window.location.hostname.split("-")[2]
      return PRNumber
        ? `https://github.com/betagouv/aides-jeunes/pull/${PRNumber}`
        : null
    },
  },
}
</script>

<style lang="scss" scoped>
.bandeau-demo-wrapper {
  position: absolute;
  overflow: hidden;
  top: 0;
  right: 0;
  width: 160px;
  height: 160px;
  pointer-events: none;

  .bandeau-demo {
    position: absolute;
    right: -39px;
    top: 23px;
    background: #5770be;
    background: var(--theme-primary);
    padding: 8px 48px;
    border-radius: 0;
    font-weight: 700;
    font-size: 24px;
    color: white;
    transform: rotate(45deg);
    pointer-events: all;
  }
}
</style>
