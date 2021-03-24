<template>
  <div class="container">
    <div class="aj-main-container">
      <TitreChapitre />
      <div class="aj-box-wrapper">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
import TitreChapitre from '@/components/TitreChapitre'

export default {
  name: 'Simulation',
  components: {
    TitreChapitre
  },
  data() {
    return {
      window
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
