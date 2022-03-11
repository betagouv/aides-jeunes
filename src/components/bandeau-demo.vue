<template>
  <div v-if="afficheBandeau" class="bandeau-demo-wrapper">
    <a class="bandeau-demo" target="_blank" rel="noopener" :href="link">
      Démo
    </a>
    <router-link class="lien-debug" :to="{ debugLink }"
      >Accéder à l'aide créée</router-link
    >
  </div>
</template>

<script>
export default {
  name: "BandeauDemo",
  computed: {
    afficheBandeau() {
      return process.env.VUE_APP_CONTEXT === "deploy-preview"
    },
    link() {
      return process.env.VUE_APP_PR_URL
    },
    debugLink() {
      //process.env.VUE_APP_NETLIFY_PR
      return "/simulation/resultats?debug"
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

  .lien-debug {
    position: fixed;
    inset: auto 30px 70px auto;
    display: block;
    background: #5770be;
    padding: 5px 10px;
    border-radius: 15px;
    color: #ffffff;
  }
}
</style>
