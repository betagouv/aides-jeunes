<template>
  <div class="container">
    <SimulationProgress />
    <div class="aj-main-container">
      <TitreChapitre />
      <div class="aj-box-wrapper">
        <router-view/>
      </div>
      <BoutonRetour text="Retour"/>
    </div>
  </div>
</template>

<script>
import BoutonRetour from '@/components/BoutonRetour'
import TitreChapitre from '@/components/TitreChapitre'
import SimulationProgress from '@/components/Progress'

export default {
  name: 'Simulation',
  components: {
    BoutonRetour,
    TitreChapitre,
    SimulationProgress
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
    .container {
        max-width: 100%;
        display: flex;
    }
</style>
