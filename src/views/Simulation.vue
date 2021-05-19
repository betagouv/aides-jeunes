<template>
  <div class="container aj-layout-container" :class="{'aj-debug-container': debug}">
    <div class="aj-main-container">
      <TitreChapitre />
      <div v-if="debug" class="aj-debug-switch">
        <button class="button small" @click="disableDebug"
          >Quitter le mode debug</button
        >
      </div>
      <div v-if="$store.state.message.text" class="notification warning">
        <div class="message" v-html="$store.state.message.text" />
      </div>
      <div class="aj-box-wrapper">
        <router-view />
      </div>
    </div>
    <Progress v-if="debug" />
    <Sommaire/>
  </div>
</template>

<script>
import TitreChapitre from '@/components/TitreChapitre'
import Progress from '@/components/Progress'
import Sommaire from '@/components/Sommaire'

export default {
  name: "Simulation",
  components: {
    TitreChapitre,
    Progress,
    Sommaire
  },
  data() {
    return {
      window,
    }
  },
  computed: {
    debug() {
      return this.$store.getters.getDebug
    },
  },
  methods: {
    disableDebug() {
      this.$store.dispatch("setDebug", false)
      this.$router.replace({ debug: null })
    },
  },
}
</script>

<style type="text/css" scoped>
/* Hack for dev */
/*.container {*/
/*max-width: 100%;*/
/*display: flex;*/
/*}*/
</style>
