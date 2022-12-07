<template>
  <form class="simulation-search" @submit="onSubmit">
    <label for="surveyEmail" class="fr-label fr-text--lead fr-mb-0"
      >Rechercher un sondage par adresse email :</label
    >
    <div class="aj-flex-row">
      <input
        id="surveyEmail"
        v-model="surveyEmail"
        class="fr-input"
        type="text"
        placeholder="Email de l'utilisateur"
        required
      />
      <button class="fr-btn">Rechercher</button>
    </div>
  </form>
</template>

<script>
export default {
  name: "SimulationSearch",
  data() {
    return {
      situationId: "",
    }
  },
  methods: {
    onSubmit() {
      const situationId = /([a-z0-9]{24})/.exec(this.situationId)[0]
      window?.open(`/api/support/simulation/${situationId}`, "_blank").focus()
    },
  },
}
</script>
