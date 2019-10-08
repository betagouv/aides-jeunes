<template>
  <div class="container">
    <div class="frame-foyer">
      <h1>Vous</h1>
      <InputDate v-model="individu.date_naissance"/>
    </div>
    <div class="text-right">
      <button class="button large" v-on:click="next">Valider</button>
    </div>
  </div>
</template>

<script>
import InputDate from '@/components/InputDate'
import Individu from '@/lib/Individu'

export default {
  name: 'demandeur',
  components: {
    InputDate
  },
  data () {
    let s = this.$SituationService.restoreLocal()
    let i = Individu.get(s.individus, 'demandeur')
    return {
      situation: s,
      individu: i,
    }
  },
  methods: {
    next: function() {
      this.situation.individus[0] = Object.assign({}, this.individu)
      this.$SituationService.saveLocal()
      this.$router.push('/foyer/enfants')
    }
  }
}
</script>
