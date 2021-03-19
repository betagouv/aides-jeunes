<template>
  <div class="container">
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

export default {
  name: 'Simulation',
  components: {
    BoutonRetour,
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
</style>
