<template>
  <form @submit.prevent="onSubmit">
    <YesNoQuestion v-model="value">
      {{ getLabel("avoir") | capitalize }} prévu d'étudier
      <a
        target="_blank"
        rel="noopener"
        href="https://www.education.gouv.fr/les-regions-academiques-academies-et-services-departementaux-de-l-education-nationale-6557"
        >hors de votre académie</a
      >
      l'an prochain&nbsp;?
    </YesNoQuestion>
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import YesNoQuestion from "@/components/YesNoQuestion"
import { createIndividuMixin } from "@/mixins/IndividuMixin"

export default {
  name: "SimulationIndividuAideMobiliteParcoursupSortieAcademie",
  components: {
    Actions,
    YesNoQuestion,
  },
  mixins: [createIndividuMixin("aide_mobilite_parcoursup_sortie_academie")],
}
</script>
