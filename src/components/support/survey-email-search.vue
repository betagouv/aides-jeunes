<template>
  <form class="simulation-search" @submit.prevent="onSubmit">
    <label for="surveyEmail" class="fr-label fr-text--lead fr-mb-0"
      >Rechercher un sondage par adresse email :</label
    >
    <div class="aj-flex-row">
      <input
        id="surveyEmail"
        v-model="surveyEmail"
        class="fr-input"
        type="email"
        placeholder="Email de l'utilisateur"
        required
      />
      <button class="fr-btn">Rechercher</button>
    </div>
  </form>
</template>

<script lang="ts">
export default {
  name: "SimulationSearch",
  data() {
    return {
      surveyEmail: "",
    }
  },
  methods: {
    onSubmit() {
      window.location.href = `/accompagnement/?surveyEmail=${this.surveyEmail}`
    },
  },
}
</script>
