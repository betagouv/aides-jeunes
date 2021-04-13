<template>
  <div class="container aj-layout-container" :class="{'aj-debug-container': debug}">
      <Wizard/>
      <Progress v-if="debug" />
    <div class="aj-main-container">
      <TitreChapitre />
      <div v-if="debug" class="aj-debug-switch">
          <button class="button small" @click="disableDebug">Quitter le mode debug</button>
      </div>
      <div class="aj-box-wrapper">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
import TitreChapitre from '@/components/TitreChapitre'
import Progress from '@/components/Progress'
import Wizard from '@/components/Wizard'

export default {
  name: 'Simulation',
  components: {
    TitreChapitre,
    Progress,
    Wizard
  },
  data() {
    return {
      window
    }
  },
  computed: {
    debug() {
      return this.$store.getters.getDebug
    }
  },
  methods: {
    disableDebug() {
      this.$store.dispatch('setDebug', false)
      this.$router.replace({'debug': null});
    }
  }
}
</script>

<style type="text/css" scoped>
    /* Hack for dev */
    /*.container {*/
        /*max-width: 100%;*/
        /*display: flex;*/
    /*}*/
</style>
