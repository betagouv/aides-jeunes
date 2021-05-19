<template>
  <form>
    <label class="form__group">
      Temps de travail par semaine
      <input
        type="number"
        v-select-on-click
        v-model.number="agepi_temps_travail_semaine"
      />
    </label>

    <div class="text-right">
      <button type="submit" class="button large" v-on:click.prevent="next"
        >Valider</button
      >
    </div>
  </form>
</template>

<script>
export default {
  name: "pole-emploi",
  data() {
    const demandeur = this.$store.state.situation.demandeur
    return {
      demandeur,
      agepi_temps_travail_semaine: demandeur.agepi_temps_travail_semaine,
    }
  },
  methods: {
    next: function () {
      this.$store.dispatch(
        "updateIndividu",
        Object.assign({}, this.demandeur, {
          agepi_temps_travail_semaine: this.agepi_temps_travail_semaine,
        })
      )
      this.$push()
    },
  },
}
</script>

<style scoped lang="css"></style>
