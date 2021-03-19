<template>
  <form @submit.prevent='onSubmit'>
    <h1>{{ role === 'demandeur' ? 'Quelle est votre nationalité&nbsp;?' : `Quelle est la nationalité de ${getLabel('nom')}&nbsp;?` }}</h1>
    <NationalityChoice v-model="value" />
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import NationalityChoice from '@/components/NationalityChoice'
import { createIndividuMixin } from '@/mixins/IndividuMixin'

export default {
  name: 'SimulationIndividuNationalite',
  components: {
    Actions,
    NationalityChoice
  },
  mixins: [createIndividuMixin('nationalite')],
}
</script>
