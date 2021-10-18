<template>
  <span
    class="aj-aide-montant"
    itemscope
    itemtype="http://schema.org/Offer"
    itemprop="offers"
  >
    <span class="aj-aide-montant-label">
      <span itemprop="price" v-if="isNumber(droit.type)" class="montant">
        <span class="font-normal font-base">
          {{ ayantDroit.label }}
        </span>
        <br />
        {{ ayantDroit.value }}
      </span>
      <span v-else-if="isBoolean(droit.type)">
        <i
          :data-testid="`droit-montant-icon-${
            ayantDroit.symbol ? ayantDroit.symbol : 'fa-check-circle'
          }`"
          v-bind:class="`fa ${
            ayantDroit.symbol ? ayantDroit.symbol : 'fa-check-circle'
          } fa-2x`"
        >
        </i>
      </span>
      <span v-if="ayantDroit.legend" class="montant-detail">
        {{ ayantDroit.legend }}
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
import { formatAyantDroit } from "../../lib/benefits"

export default {
  name: "DroitMontant",
  props: {
    droit: Object,
  },
  computed: {
    ayantDroit: function () {
      return formatAyantDroit(this.droit)
    },
    showUnexpected: function () {
      return (
        (this.droit.id === "ppa" &&
          (this.$store.getters.isProprietaireAvecPretEnCours ||
            this.$store.getters.isHebergeParticipeFrais)) ||
        (this.droit.isBaseRessourcesYearMinusTwo &&
          !this.$store.getters.ressourcesYearMinusTwoCaptured) ||
        this.droit.showUnexpectedAmount
      )
    },

    list: function () {
      let vm = this
      return this.droits.filter(this.droits, function (value) {
        return !vm.filter || vm.filter.includes(value.id)
      })
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
    isBoolean: (val) => val === "bool",
    isNumber: (val) => val === "number",
    isString: (val) => typeof val === "string",
    getFractionSize: function (droit) {
      return droit.floorAt < 1 ? 2 : 0
    },
  },
}
</script>
