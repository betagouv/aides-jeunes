<template>
  <form>
    <div>
      <router-link to="/simulation/resultats/">
        <h2 aria-label="Retour aux résultats">
          <i class="fa fa-arrow-circle-left" aria-hidden="true"></i> Retour aux
          résultats
        </h2>
      </router-link>
    </div>

    <h3>Le montant indiqué pour {{ longLabel }} vous semble inexact&nbsp;?</h3>

    <ResultatInattenduPpa v-if="droit.id === 'ppa'"></ResultatInattenduPpa>
    <ResultatInattenduAideLogement
      v-else-if="droit.id === 'aide_logement'"
    ></ResultatInattenduAideLogement>
    <ResultatInattenduGarantieJeune
      v-else-if="droit.id === 'garantie_jeunes'"
    ></ResultatInattenduGarantieJeune>
    <ResultatInattenduYearMinusTwo
      :droit="droit"
      v-else
    ></ResultatInattenduYearMinusTwo>
  </form>
</template>

<script>
import Institution from "@/lib/Institution"
import ResultatInattenduAideLogement from "@/components/ResultatInattendu/AideLogement"
import ResultatInattenduGarantieJeune from "@/components/ResultatInattendu/GarantieJeune"
import ResultatInattenduPpa from "@/components/ResultatInattendu/Ppa"
import ResultatInattenduYearMinusTwo from "@/components/ResultatInattendu/YearMinusTwo"

export default {
  name: "resultat-inattendu",
  components: {
    ResultatInattenduAideLogement,
    ResultatInattenduGarantieJeune,
    ResultatInattenduPpa,
    ResultatInattenduYearMinusTwo,
  },
  data: function () {
    let benefitKeyed = {}
    Institution.forEachBenefit(
      (benefit, benefitId, provider, providerId, level) => {
        const benefit_temp = Object.assign(
          { id: benefitId, provider: { ...provider, id: providerId }, level },
          benefit
        )
        if (benefit_temp.label === "Tarification solidaire transports") {
          benefit_temp.label = `${benefit_temp.label} - ${provider.label}`
        }
        benefitKeyed[benefit_temp.id] = benefit_temp
      }
    )
    return {
      benefitKeyed,
    }
  },
  computed: {
    droit: function () {
      return this.benefitKeyed[this.$route.params.id]
    },
    longLabel: function () {
      let prefix = `${this.droit.prefix}${
        this.droit.prefix && this.droit.prefix.endsWith("’") ? "" : " "
      }`
      return `${prefix}${this.droit.label}`
    },
  },
}
</script>
