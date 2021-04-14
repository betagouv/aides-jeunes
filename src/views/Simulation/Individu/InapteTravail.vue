<template>
  <form @submit.prevent='onSubmit'>
    <YesNoQuestion v-model="value">
      {{ getLabel('être') | capitalize }} reconnu·e inapte au travail ? <EnSavoirPlus :text="hint" routeName="inapte_en_savoir_plus" />
    </YesNoQuestion>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import YesNoQuestion from '@/components/YesNoQuestion'
import { createIndividuMixin } from '@/mixins/IndividuMixin'
import EnSavoirPlus from "@/components/EnSavoirPlus"

export default {
  name: 'SimulationIndividuInapteTravail',
  components: {
    Actions,
    YesNoQuestion,
    EnSavoirPlus
  },
    data() {
        return {
            hint: 'Vous pouvez être "inapte au travail" après un accident ou une maladie par exemple : c\'est le médecin du travail qui détermine cela.'
        }
    },
  mixins: [createIndividuMixin('inapte_travail')],
}
</script>
