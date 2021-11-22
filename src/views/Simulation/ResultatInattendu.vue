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

    <component
      v-if="resultatsInattendus[droit.id]"
      :is="resultatsInattendus[droit.id]"
    />
    <ResultatInattenduYearMinusTwo :droit="droit" v-else />
  </form>
</template>

<script>
import ResultatInattenduAideLogement from "@/components/ResultatInattendu/AideLogement"
import ResultatInattenduGarantieJeune from "@/components/ResultatInattendu/GarantieJeune"
import ResultatInattenduPpa from "@/components/ResultatInattendu/Ppa"
import ResultatInattenduYearMinusTwo from "@/components/ResultatInattendu/YearMinusTwo"
const benefits = require("@/../data/js/benefits/back")

const RESULTATS_INATTENDUS = {
  aide_logement: ResultatInattenduAideLogement,
  garantie_jeunes: ResultatInattenduGarantieJeune,
  ppa: ResultatInattenduPpa,
}

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
    benefits.all.forEach((benefit) => {
      const benefit_temp = Object.assign(
        { provider: benefit.institution, level: benefit.institution.level },
        benefit
      )
      if (benefit_temp.label === "Tarification solidaire transports") {
        benefit_temp.label = `${benefit_temp.label} - ${benefit.institution.label}`
      }
      benefitKeyed[benefit_temp.id] = benefit_temp
    })

    return {
      benefitKeyed,
      resultatsInattendus: RESULTATS_INATTENDUS,
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
