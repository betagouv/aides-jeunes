<template>
  <span
    class="aj-aide-montant"
    itemscope
    itemtype="http://schema.org/Offer"
    itemprop="offers"
  >
    <span class="aj-aide-montant-label">
      <span itemprop="price" ng-if="isNumber(droit.montant)" class="montant">
        <span class="font-normal font-base"
          >{{ droit.participation ? "Coût" : "Montant" }} estimé</span
        ><br />
        {{
          droit.montant | currency(droit.unit || "€", getFractionSize(droit))
        }}
      </span>
      <span v-if="isString(droit.montant)">
        <i class="fa fa-question-circle fa-2x"></i>
      </span>
      <span v-if="isNumber(droit.montant)" class="montant-detail">
        {{ legend }}
      </span>
    </span>
    <span class="montant-inattendu">
      <router-link
        :to="{ name: 'resultatInattendu', params: { id: droit.id } }"
        v-if="showUnexpected"
        >Montant inattendu ?
      </router-link>
    </span>
  </span>
</template>

<script>
import currency from "currency.js"
import { getBenefitLegend } from "../../lib/benefits"

export default {
  name: "DroitMontant",
  props: {
    droit: Object,
  },
  computed: {
    showUnexpected: function () {
      return (
        (this.droit.id === "ppa" &&
          (this.$store.getters.isProprietaireAvecPretEnCours ||
            this.$store.getters.isHebergeParticipeFrais)) ||
        (this.droit.isBaseRessourcesYearMinusTwo &&
          !this.$store.getters.ressourcesYearMinusTwoCaptured) ||
        this.droit.showUnexpectedAmount ||
        this.droit.id === "garantie_jeunes"
      )
    },

    list: function () {
      let vm = this
      return this.droits.filter(this.droits, function (value) {
        return !vm.filter || vm.filter.includes(value.id)
      })
    },
    legend: function () {
      return getBenefitLegend(this.droit)
    },
  },
  filters: {
    currency: function (value, unit, frac) {
      return currency(value, {
        symbol: ` ${unit}`,
        pattern: "#!",
        precision: frac,
      }).format()
    },
  },
  methods: {
    isEmpty: (array) => array.length === 0,
    isNotEmpty: (array) => array.length !== 0,
    isBoolean: (val) => typeof val === "boolean",
    isNumber: (val) => typeof val === "number",
    isString: (val) => typeof val === "string",
    getFractionSize: function (droit) {
      return droit.floorAt < 1 ? 2 : 0
    },
  },
}
</script>
