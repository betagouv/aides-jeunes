<template>
  <div v-if="droit.type && $route.name !== 'aide'" class="aj-droit-estime">
    <div>
      <template v-if="isBenefitTypeNumber || isBenefitTypeString">
        <span>
          <span class="aj-droit-estime-label font-normal font-base">
            {{ droitEstime.label }}
          </span>
          <br />
          <span class="aj-droit-estime-value font-bold">
            {{ droitEstime.value }}
          </span>
        </span>
        <span v-if="droitEstime.legend" class="aj-droit-estime-legend">
          {{ droitEstime.legend }}
        </span>
      </template>
      <span v-else-if="isBenefitTypeBoolean">
        <i
          :data-testid="`aj-droit-estime-icon-${
            droitEstime.icon ? droitEstime.icon : 'fa-check-circle'
          }`"
          :class="`fa ${
            droitEstime.icon ? droitEstime.icon : 'fa-check-circle'
          } fa-2x`"
        />
      </span>
    </div>
    <div class="aj-droit-estime-inattendu">
      <router-link
        v-if="showUnexpected"
        :to="{ name: 'resultatInattendu', params: { id: droit.id } }"
        >Montant inattendu ?
      </router-link>
    </div>
  </div>
</template>

<script>
import { formatDroitEstime } from "@/../lib/benefits/details"

export default {
  name: "DroitEstime",
  props: {
    droit: Object,
  },
  computed: {
    droitEstime() {
      return formatDroitEstime(
        this.droit,
        this.$store.state.openFiscaParameters
      )
    },
    isBenefitTypeBoolean() {
      return this.droitEstime.type === "bool"
    },
    isBenefitTypeNumber() {
      return this.droitEstime.type === "float"
    },
    isBenefitTypeString() {
      return this.droitEstime.type === "string"
    },
    showUnexpected() {
      return (
        (this.droit.isBaseRessourcesYearMinusTwo &&
          !this.$store.getters.ressourcesYearMinusTwoCaptured) ||
        this.droit.showUnexpectedAmount
      )
    },
  },
}
</script>
<style></style>
