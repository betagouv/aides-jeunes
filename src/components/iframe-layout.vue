<template>
  <Header1J1S v-if="headerCollapse" :collapse="headerCollapse" />
  <slot />
  <div class="aj-iframe-footer-body">
    <div class="aj-iframe-footer">
      <p>
        Simulateur propulsé par
        <a href="https://www.1jeune1solution.gouv.fr/" target="_blank">
          la plateforme 1jeune1solution
        </a>
      </p>
      <p class="aj-iframe-footer-mob-height">-</p>
      <p>
        Accédez à nos
        <a href="https://mes-aides.1jeune1solution.beta.gouv.fr/cgu">CGU</a></p
      >
    </div>
  </div>
</template>

<script>
import Header1J1S from "@/components/header-1j1s.vue"
import { useStore } from "@/stores"
export default {
  name: "IFrameLayout",
  components: {
    Header1J1S,
  },
  setup() {
    return {
      store: useStore(),
    }
  },
  computed: {
    headerCollapse: function () {
      return this.store.iframeHeaderCollapse
    },
  },
}
</script>

<style>
html,
body {
  height: unset !important;
}

.iframe-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}
</style>
