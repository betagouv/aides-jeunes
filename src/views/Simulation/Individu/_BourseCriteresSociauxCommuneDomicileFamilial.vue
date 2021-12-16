<template>
  <form @submit.prevent="onSubmit">
    <div class="form__group">
      <label class="aj-question">
        Quel est le code postal de la commune de vos parents ?
      </label>
      <input id="cp" type="number" v-model="codePostal" />
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
import Individu from "@/../lib/Individu"
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
        this.$store.dispatch(
          "updateError",
          "Le code postal est invalide. Le simulateur accepte uniquement les codes postaux français pour le moment."
        )
        return
      }
      const matchingCommune = this.communes.find(
        (c) => c.nom == this.nomCommune
      )
      if (matchingCommune) {
        this.$store.dispatch("answer", {
          id: "demandeur",
          entityName: "individu",
          fieldName: "_bourseCriteresSociauxCommuneDomicileFamilial",
          value: {
            _bourseCriteresSociauxCommuneDomicileFamilial: matchingCommune.code,
            _bourseCriteresSociauxCommuneDomicileFamilialCodePostal:
              this.codePostal.toString(),
            _bourseCriteresSociauxCommuneDomicileFamilialNomCommune:
              this.nomCommune,
            _bourseCriteresSociauxCommuneDomicileFamilialDepartement:
              matchingCommune.departement,
            _bourseCriteresSociauxCommuneDomicileFamilialRegion:
              matchingCommune.region,
            _bourseCriteresSociauxCommuneDomicileFamilialEpci:
              matchingCommune.epci,
            _bourseCriteresSociauxCommuneDomicileFamilialEpciType:
              matchingCommune.epciType,
          },
        })
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
