<template>
  <form class="simulation-search" @submit="onSubmit">
    <label for="simulationId" class="fr-label fr-text--lead fr-mb-0"
      >Accéder à une simulation :</label
    >
    <div class="aj-flex-row">
      <input
        id="simulationId"
        v-model="simulationId"
        class="fr-input"
        type="text"
        placeholder="ID de la simulation"
        required
      />
      <button class="fr-btn">Accéder</button>
    </div>
  </form>
</template>

<script lang="ts">
export default {
  name: "SimulationSearch",
  data() {
    return {
      simulationId: "",
    }
  },
  methods: {
    onSubmit() {
      const simulationId = /([a-z0-9]{24})/.exec(this.simulationId)[0]
      window?.open(`/api/support/simulation/${simulationId}`, "_blank").focus()
    },
  },
}
</script>
