<template>
  <form @submit.prevent='onSubmit'>
    <h1>Quelle est votre nationalité&nbsp;?</h1>
    <NationalityChoice v-model="nationalite" />
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import NationalityChoice from '@/components/NationalityChoice'
import Individu from '@/lib/Individu'

export default {
  name: 'SimulationIndividuNationalite',
  components: {
    Actions,
    NationalityChoice
  },
  data: function() {
    const id = this.$route.params.id
    const role = id.split('_')[0]
    const {individu} = Individu.get(this.$store.getters.peopleParentsFirst, role, this.$route.params.id, this.$store.state.dates)
    const nationalite = individu.nationalite
    return {
      individu,
      id,
      nationalite,
    }
  },
  methods: {
    onSubmit: function() {
      this.individu.nationalite = this.nationalite
      this.$store.dispatch('updateIndividu', this.individu)
      this.$push()
    }
  }
}
</script>
