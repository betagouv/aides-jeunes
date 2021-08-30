<template>
  <form @submit.prevent="onSubmit">
    <div class="form__group">
      <label class="aj-question">
        Quel est le code postal de la commune de vos parents ?
      </label>
      <input type="number" v-model="codePostal" />
    </div>

    <p v-if="retrievingCommunes"
      ><i class="fa fa-spinner fa-spin" aria-hidden="true"></i
    ></p>
    <div class="form__group" v-show="communes && communes.length">
      <label class="aj-question">
        Veuillez sélectionner la ville qui correspond
      </label>
      <select v-model="nomCommune" id="commune">
        <option
          v-for="commune in communes"
          v-bind:value="commune.nom"
          v-bind:key="commune.code"
        >
          {{ commune.nom }}
        </option>
      </select>
    </div>
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>
<script>
import Actions from "@/components/Actions"
import Individu from "@/lib/Individu"
import DepcomMixin from "@/mixins/DepcomMixin"

export default {
  name: "SimulationIndividuBourseCriteresSociauxCommuneDomicileFamilial",
  mixins: [DepcomMixin],
  components: {
    Actions,
  },
  data() {
    const id = this.$route.params.id
    const role = id.split("_")[0]
    const { individu } = Individu.get(
      this.$store.getters.peopleParentsFirst,
      role,
      this.$route.params.id,
      this.$store.state.dates
    )
    const codePostal =
      individu._bourseCriteresSociauxCommuneDomicileFamilialCodePostal
    const nomCommune =
      individu._bourseCriteresSociauxCommuneDomicileFamilialNomCommune
    return {
      codePostal,
      individu,
      nomCommune,
      retrievingCommunes: false,
    }
  },
  methods: {
    onSubmit: function () {
      if (!this.nomCommune || !this.codePostal) {
        this.$store.dispatch("updateError", "Ce champ est obligatoire.")
        return
      }
      if (!this.codePostal.match(/^(?:[0-8]\d|9[0-8])\d{3}$/)) {
        this.$store.dispatch("updateError", "Le code postal n'est pas valide.")
        return
      }
      const communeMatches = this.communes.filter(
        (c) => c.nom == this.nomCommune
      )
      if (communeMatches.length) {
        this.individu._bourseCriteresSociauxCommuneDomicileFamilial =
          communeMatches[0].code
        this.individu._bourseCriteresSociauxCommuneDomicileFamilialCodePostal =
          this.codePostal.toString()
        this.individu._bourseCriteresSociauxCommuneDomicileFamilialNomCommune =
          this.nomCommune
        this.$store.dispatch("updateIndividu", this.individu)
      }
      this.$push()
    },
  },
}
</script>
<style scoped lang="scss">
fieldset {
  margin-bottom: 2em;
}
</style>
