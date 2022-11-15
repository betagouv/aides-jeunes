<template>
  <Header1J1S v-if="headerCollapse" :collapse="headerCollapse" />
  <slot />
  <div class="aj-iframe-footer-body">
    <div class="aj-iframe-footer">
      <p>
        Simulateur propulsé par&nbsp;
        <a href="https://www.1jeune1solution.gouv.fr/" target="_blank">
          la plateforme 1jeune1solution
        </a>
      </p>
    </div>
    <div class="aj-iframe-footer">
      <p>Accédez à nos&nbsp;</p
      ><a href="https://mes-aides.1jeune1solution.beta.gouv.fr/cgu">CGU</a>
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
