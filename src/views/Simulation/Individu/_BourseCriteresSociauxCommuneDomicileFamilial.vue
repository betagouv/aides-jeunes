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
    <template
      v-if="
        isRelevantQuestionForContribution(
          '_bourseCriteresSociauxCommuneDomicileFamilial',
          'bourse_criteres_sociaux_distance_domicile_familial'
        )
      "
    >
      <ContributionForm
        v-model="
          contribution[entityName]._bourseCriteresSociauxCommuneDomicileFamilial
        "
      ></ContributionForm>
    </template>
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>
<script>
import Actions from "@/components/Actions"
import Individu from "@/lib/Individu"
import DepcomMixin from "@/mixins/DepcomMixin"
import { createContributionMixin } from "@/mixins/ContributionMixin"
import ContributionForm from "@/components/ContributionForm"

export default {
  name: "SimulationIndividuBourseCriteresSociauxCommuneDomicileFamilial",
  mixins: [DepcomMixin, createContributionMixin()],
  components: {
    Actions,
    ContributionForm,
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

    const contribution = this.initContribution(
      id,
      "_bourseCriteresSociauxCommuneDomicileFamilial",
      "bourse_criteres_sociaux_distance_domicile_familial"
    )
    return {
      codePostal,
      individu,
      nomCommune,
      retrievingCommunes: false,
      contribution,
    }
  },
  methods: {
    onSubmit: function () {
      if (
        this.needCheckContrib(
          this.entityName,
          "_bourseCriteresSociauxCommuneDomicileFamilial",
          "bourse_criteres_sociaux_distance_domicile_familial"
        ) &&
        (!this.nomCommune || !this.codePostal)
      ) {
        this.$store.dispatch("updateError", "Ce champ est obligatoire.")
        return
      }
      if (
        this.needCheckContrib(
          this.entityName,
          "_bourseCriteresSociauxCommuneDomicileFamilial",
          "bourse_criteres_sociaux_distance_domicile_familial"
        ) &&
        !this.codePostal.match(/^(?:[0-8]\d|9[0-8])\d{3}$/)
      ) {
        this.$store.dispatch(
          "updateError",
          "Le code postal est invalide. Le simulateur accepte uniquement les codes postaux français pour le moment."
        )
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
      this.saveContribution(
        this.entityName,
        "_bourseCriteresSociauxCommuneDomicileFamilial",
        "bourse_criteres_sociaux_distance_domicile_familial"
      )
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
