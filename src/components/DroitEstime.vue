<template>
  <span
    class="aj-aide-montant"
    itemscope
    itemtype="http://schema.org/Offer"
    itemprop="offers"
    v-if="droit.type"
  >
    <span class="aj-aide-montant-label">
      <span
        itemprop="price"
        v-if="isNumber(droitEstime.type) || isString(droitEstime.type)"
      >
        <span class="font-normal font-base">
          {{ droitEstime.label }}
        </span>
        <br />
        <span>
          {{ droitEstime.value }}
        </span>
      </span>
      <span v-else-if="isBoolean(droitEstime.type)">
        <i
          :data-testid="`droit-montant-icon-${
            droitEstime.icon ? droitEstime.icon : 'fa-check-circle'
          }`"
          v-bind:class="`fa ${
            droitEstime.icon ? droitEstime.icon : 'fa-check-circle'
          } fa-2x`"
        >
        </i>
      </span>
      <span v-if="droitEstime.legend" class="montant-detail">
        {{ droitEstime.legend }}
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
import { formatDroitEstime } from "../../lib/benefits"

export default {
  name: "DroitEstime",
  props: {
    droit: Object,
  },
  computed: {
    droitEstime: function () {
      return formatDroitEstime(this.droit)
    },
    showUnexpected: function () {
      return (
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
  methods: {
    isBoolean: (type) => type === "bool",
    isNumber: (type) => type === "float",
    isString: (type) => type === "string",
  },
}
</script>
