<template>
  <form>
    <label class="form__group">
      Temps de travail par semaine
      <InputNumber v-model="agepi_temps_travail_semaine"></InputNumber>
    </label>

    <div class="text-right">
      <button type="submit" class="button large" v-on:click.prevent="next"
        >Valider</button
      >
    </div>
  </form>
</template>

<script>
import InputNumber from "@/components/InputNumber"
export default {
  name: "pole-emploi",
  components: { InputNumber },
  data() {
    const demandeur = this.$store.getters.situation.demandeur
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
