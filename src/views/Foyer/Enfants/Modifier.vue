<template>
  <div class="container">
    <div class="frame-foyer">
      <IndividuForm v-model="individu" v-bind:existingIndividu="existingIndividu" v-on:input="emit()" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import IndividuForm from '@/components/IndividuForm'
import Individu from '@/lib/Individu'
import Situation from '@/lib/Situation'

export default {
  name: 'enfants.modifier',
  components: {
    IndividuForm
  },
  data () {
    let situation = this.$SituationService.restoreLocal()
    let enfants = Situation.getEnfants(situation)
    let { existingIndividu, individu } = Individu.get(enfants, 'enfant', this.$route.params.id, this.dates)

    return {
      existingIndividu,
      individu,
      situation
    }
  },
  methods: {
    emit: function() {
      let enfants = Situation.getEnfants(this.situation)
      let resolved = _.find(enfants, (item) => {
          return item.id === this.individu.id;
      });
      let index = enfants.indexOf(resolved);
      if (-1 !== index) {
          enfants.splice(index, 1, this.individu);
      }
      Situation.setEnfants(this.situation, enfants)

      this.$SituationService.saveLocal()
      this.$push()
    }
  }
}
</script>

<style scoped lang="css">
</style>
