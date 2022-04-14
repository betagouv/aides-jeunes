<template>
  <form class="simulation-search" @submit="onSubmit">
    <label for="simulationId" class="aj-question"
      >Accéder à une simulation :</label
    >
    <div class="simulation-search-input">
      <input
        id="simulationId"
        v-model="situationId"
        style="max-width: 400px"
        type="text"
        placeholder="ID de la simulation"
        required
      />
      <button class="button primary">Accéder</button>
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
      window
        ?.open(`/api/support/simulation/${this.situationId}`, "_blank")
        .focus()
    },
  },
}
</script>

<style lang="scss" scoped>
.simulation-search {
  margin-bottom: 24px;
  .simulation-search-input {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }
}
</style>
