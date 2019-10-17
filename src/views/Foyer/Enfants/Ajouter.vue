<template>
  <div class="container">
    <div class="text-right">
      <button class="button large" v-on:click="next">Ajouter</button>
    </div>
  </div>
</template>

<script>
import Individu from '@/lib/Individu'
import Situation from '@/lib/Situation'

export default {
  name: 'enfants.ajouter',
  components: {
  },
  data () {    
    return {

    }
  },
  methods: {
    next: function() {
      let s = this.$SituationService.restoreLocal()
      let enfants = Situation.getEnfants(s)

      var enf = Individu.get(enfants, 'enfant', 1)
      enf.date_naissance = new Date('2010-12-12')
      enfants.push(enf)
      Situation.setEnfants(s, enfants)

      this.$SituationService.saveLocal()
      this.$router.push('/foyer/enfants')
    },
  }
}
</script>

<style scoped lang="css">
</style>
