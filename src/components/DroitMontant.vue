<template>
  <span class="aj-aide-montant" itemscope itemtype="http://schema.org/Offer" itemprop="offers">
    <span class="aj-aide-montant-label">
      <span itemprop="price" ng-if="isNumber(droit.montant)" class="montant">
        <span class="font-normal font-base">Montant estimé</span><br>
        {{ droit.montant | currency(( droit.unit || '€' ), getFractionSize(droit)) }}
      </span>
      <span v-if="isString(droit.montant)">
        <i class="fa fa-question-circle fa-2x"></i>
      </span>
      <span v-if="isNumber(droit.montant)" class="montant-detail">
        {{ droit.legend !== undefined ? droit.legend : (droit.isMontantAnnuel ? '/ an' : '/ mois') }}
      </span>
    </span>
    <!--<router-link class="droit-montant-unexpected"-->
      <!--:to="{ name: 'resultat/inattendu', params: { id: droit.id }}"-->
      <!--v-analytics="{ name:droit.label, action:'show-unexpected', category:'General'}"-->
      <!--v-if="showUnexpected">-->
      <!--Montant inattendu ?-->
    <!--</router-link>-->
  </span>
</template>

<script>
import currency from 'currency.js'

export default {
  name: 'DroitMontant',
  props: {
    droit: Object,
  },
  computed: {
    showUnexpected: function() {
      return (this.droit.id === 'ppa' && (this.$store.getters.isProprietaireAvecPretEnCours || this.$store.getters.isHebergeParticipeFrais)) || (this.droit.isBaseRessourcesYearMinusTwo && !this.$store.getters.ressourcesYearMinusTwoCaptured)
    },

    list: function() {
      let vm = this
      return this.droits.filter(this.droits, function(value) {
        return (!vm.filter) || vm.filter.includes(value.id)
      })
    },
  },
  filters : {
    currency: function(value, unit, frac) {
      return currency(value, { symbol: ` ${unit}`, pattern: '#!', precision: frac }).format()
    }
  },
  methods: {
    isEmpty: (array) => array.length === 0,
    isNotEmpty: (array) => array.length !== 0,
    isBoolean: val => typeof val === 'boolean',
    isNumber: val => typeof val === 'number',
    isString: val => typeof val === 'string',
    getFractionSize: function(droit) {
      return droit.floorAt < 1 ? 2 : 0;
    }
  },
}
</script>
