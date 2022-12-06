<template>
  <form class="simulation-search" @submit="onSubmit">
    <label for="simulationId" class="fr-label fr-text--lead fr-mb-0"
      >Accéder à une simulation :</label
    >
    <div class="aj-flex-row">
      <input
        id="simulationId"
        v-model="situationId"
        class="fr-input"
        type="text"
        placeholder="ID de la simulation"
        required
      />
      <button class="fr-btn">Accéder</button>
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
