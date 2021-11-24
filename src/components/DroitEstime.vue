<template>
  <div
    v-if="droit.type"
    class="aj-droit-estime"
  >
    <span>
      <span v-if="isNumber(droitEstime.type) || isString(droitEstime.type)">
        <span class="aj-droit-estime-label font-normal font-base">
          {{ droitEstime.label }}
        </span>
        <br>
        <span class="aj-droit-estime-value font-bold">
          {{ droitEstime.value }}
        </span>
      </span>
      <span v-else-if="isBoolean(droitEstime.type)">
        <i
          :data-testid="`aj-droit-estime-icon-${
            droitEstime.icon ? droitEstime.icon : 'fa-check-circle'
          }`"
          :class="`fa ${
            droitEstime.icon ? droitEstime.icon : 'fa-check-circle'
          } fa-2x`"
        />
      </span>
      <span
        v-if="droitEstime.legend"
        class="aj-droit-estime-legend"
      >
        {{ droitEstime.legend }}
      </span>
    </span>
    <span class="aj-droit-estime-inattendu">
      <router-link
        v-if="showUnexpected"
        :to="{ name: 'resultatInattendu', params: { id: droit.id } }"
      >Montant inattendu ?
      </router-link>
    </span>
  </div>
</template>

<script>
import { formatDroitEstime } from "@/../lib/Benefits/Details"

export default {
  name: "DroitEstime",
  props: {
    droit: Object,
  },
  computed: {
    droitEstime: function () {
      return formatDroitEstime(
        this.droit,
        this.$store.state.openFiscaParameters
      )
    },
    showUnexpected: function () {
      return (
        (this.droit.isBaseRessourcesYearMinusTwo &&
          !this.$store.getters.ressourcesYearMinusTwoCaptured) ||
        this.droit.showUnexpectedAmount
      )
    },
  },
  methods: {
    isBoolean: (type) => type === "bool",
    isNumber: (type) => type === "float",
    isString: (type) => type === "string",
  },
}
</script>
<style></style>
