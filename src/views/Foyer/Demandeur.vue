<template>
  <div class="container">
    <div class="frame-foyer">
      <h1>Vous</h1>
      <IndividuForm v-model="individu" v-bind:existingIndividu="existingIndividu" v-on:input="emit()" />
    </div>
  </div>
</template>

<script>
import IndividuForm from '@/components/IndividuForm'
import Individu from '@/lib/Individu'

export default {
  name: 'demandeur',
  components: {
    IndividuForm
  },
  data () {
    let situation = this.$SituationService.restoreLocal()
    let { existingIndividu, individu } = Individu.get(situation.individus, 'demandeur')

    return {
      existingIndividu,
      individu,
      situation
    }
  },
  methods: {
    emit: function() {
      this.situation.individus[0] = Object.assign({}, this.individu)
      this.$SituationService.saveLocal()
      this.$push()
    }
  }
}
</script>
