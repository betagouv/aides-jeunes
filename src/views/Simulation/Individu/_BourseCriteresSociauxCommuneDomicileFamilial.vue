<template>
  <form @submit.prevent="onSubmit">
    <div class="form__group">
      <label class="aj-question">
        Quel est le code postal de la commune de vos parents ?
      </label>
      <input
        id="cp"
        v-model="codePostal"
        type="text"
        data-type="number"
        pattern="[0-9]*"
      />
    </div>

    <p v-if="retrievingCommunes">
      <i class="fa fa-spinner fa-spin" aria-hidden="true" />
    </p>
    <div v-show="communes && communes.length" class="form__group">
      <label class="aj-question">
        Veuillez sélectionner la ville qui correspond
      </label>
      <select id="commune" v-model="nomCommune">
        <option
          v-for="(commune, index) in communes"
          :key="`commune_${index}`"
          :value="commune.nom"
        >
          {{ commune.nom }}
        </option>
      </select>
    </div>
    <ActionButtons :on-submit="onSubmit" />
  </form>
</template>
<script>
import ActionButtons from "@/components/ActionButtons"
import Individu from "@/../lib/Individu"
import DepcomMixin from "@/mixins/DepcomMixin"

export default {
  name: "SimulationIndividuBourseCriteresSociauxCommuneDomicileFamilial",
  components: {
    ActionButtons,
  },
  mixins: [DepcomMixin],
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
      communes: [],
    }
  },
  watch: {
    codePostal: function (cp) {
      this.nomCommune = null
      this.communes = []
      if (cp?.length == 5) {
        this.fetchCommune()
      }
    },
  },
  beforeMount() {
    if (this.codePostal && this.codePostal.length == 5) {
      this.fetchCommune()
    }
  },
  methods: {
    onSubmit: function () {
      if (!this.nomCommune || !this.codePostal) {
        this.$store.dispatch("updateError", "Ce champ est obligatoire.")
        return
      }
      if (!this.codePostal.toString().match(/^(?:[0-8]\d|9[0-8])\d{3}$/)) {
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
