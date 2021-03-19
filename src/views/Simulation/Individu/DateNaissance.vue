<template>
  <form @submit.prevent='onSubmit'>
    <legend>
        {{ role === 'demandeur' ?
        `Quelle est votre date de naissance&nbsp;?` :
        `Quelle est la date de naissance ${individu._firstName || individu.id }&nbsp;?`}}
    </legend>
    <InputDate required id="date_naissance" v-model="value" />
    <p class="notification warning" v-if="error">
        Ce champ est obligatoire.
    </p>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import InputDate from '@/components/InputDate'
import { createIndividuMixin } from '@/mixins/IndividuMixin'

export default {
  name: 'SimulationIndividuDateNaissance',
  components: {
    Actions,
    InputDate,
  },
  mixins: [createIndividuMixin('date_naissance')],
  data () {
    return {
      error: false
    }
  },
  methods: {
    onSubmit: function() {
      if (!this.value) {
        this.error = true
        return
      }
      this.individu.date_naissance = this.value
      this.$store.dispatch('updateIndividu', this.individu)
      this.$push()
    }
  },
}
</script>
