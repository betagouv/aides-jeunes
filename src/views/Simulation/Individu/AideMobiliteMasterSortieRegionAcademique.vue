<template>
  <form @submit.prevent="onSubmit">
    <YesNoQuestion v-model="value">
      {{ getLabel("avoir") | capitalize }} prévu d'étudier
      <a
        target="_blank"
        rel="noopener"
        href="https://www.etudiant.gouv.fr/fr/aide-la-mobilite-en-master-1504#item2"
        >hors de votre région académique</a
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
  name: "SimulationIndividuAideMobiliteMasterSortieRegionAcademique",
  components: {
    Actions,
    YesNoQuestion,
  },
  mixins: [
    createIndividuMixin("aide_mobilite_master_sortie_region_academique"),
  ],
}
</script>
