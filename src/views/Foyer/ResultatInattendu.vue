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
    <ResultatInattenduYearMinusTwo
      :droit="droit"
      v-else
    ></ResultatInattenduYearMinusTwo>
  </form>
</template>

<script>
import Institution from "@/lib/Institution"
import ResultatInattenduPpa from "@/components/ResultatInattendu/Ppa"
import ResultatInattenduYearMinusTwo from "@/components/ResultatInattendu/YearMinusTwo"

export default {
  name: "resultat-inattendu",
  components: {
    ResultatInattenduPpa,
    ResultatInattenduYearMinusTwo,
  },
  data: function () {
    let benefitKeyed = {}
    Institution.forEachBenefit(
      (benefit, benefitId, provider, providerId, level) => {
        const b = Object.assign(
          { id: benefitId, provider: { ...provider, id: providerId }, level },
          benefit
        )
        if (b.label === "Tarification solidaire transports") {
          b.label = `${b.label} - ${provider.label}`
        }
        benefitKeyed[b.id] = b
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
