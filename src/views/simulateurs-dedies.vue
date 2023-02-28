<template>
  <article class="fr-article">
    <h1
      >Notre simulateur peut être réutilisé pour des parcours plus simples !</h1
    >
    <p
      >Un parcours pour les bourses sur critères sociaux est en cours
      d'expérimentation.</p
    >

    <p
      ><button class="fr-btn fr-btn--secondary" @click="() => startSimulation()"
        >normal</button
      ></p
    >
    <p
      ><button
        class="fr-btn fr-btn--secondary"
        @click="() => startSimulation('bourse_criteres_sociaux')"
        >bourse_criteres_sociaux</button
      ></p
    >
  </article>
</template>

<script>
import { useStore } from "@/stores/index.ts"

export default {
  name: "SimulationsDedies",
  methods: {
    startSimulation(journeyId) {
      const store = useStore()
      store.setSimulationJourney(journeyId)
      console.log(store.getAllSteps.length)
      this.$router.push(store.getAllSteps[1].path)
    },
  },
}
</script>
