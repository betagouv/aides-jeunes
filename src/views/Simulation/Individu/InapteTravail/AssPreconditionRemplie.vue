<template>
  <form @submit.prevent='onSubmit'>
    <ASSQuestions class="form__group" v-bind:individu="individu"
      v-if="captureEligibiliteAss"
      v-on:updateDate="ass_precondition_remplie = $event"
      v-on:updateAssPrecondition="individu.ass_precondition_remplie = $event" />
    <Actions v-bind:onSubmit='onSubmit'/>
  </form >
</template>

<script>
import Actions from '@/components/Actions'
import Individu from '@/lib/Individu'
import ASSQuestions from '@/components/ASSQuestions'

export default {
  name: 'SimulationIndividuDateDebutChomage',
  components: {
    Actions,
    ASSQuestions,
  },
  data: function() {
    const id = this.$route.params.id
    const role = id.split('_')[0]
    const {individu} = Individu.get(this.$store.getters.peopleParentsFirst, role, this.$route.params.id, this.$store.state.dates)
    const ass_precondition_remplie = individu.ass_precondition_remplie
    return {
      individu,
      id,
      ass_precondition_remplie,
      error: false,
    }
  },
  methods: {
    onSubmit: function() {
      this.individu.ass_precondition_remplie = this.ass_precondition_remplie
      this.$store.dispatch('updateIndividu', this.individu)
      this.$push()
    }
  }
}
</script>
