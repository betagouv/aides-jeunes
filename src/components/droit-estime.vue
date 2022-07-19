<template>
  <div
    v-if="
      droit.type &&
      ($route.name !== 'aide' ||
        ($route.name === 'aide' && droit.source === 'javascript'))
    "
    class="aj-droit-estime"
  >
    <div>
      <template v-if="isBenefitTypeNumber || isBenefitTypeString">
        <span>
          <span class="aj-droit-estime-label font-normal font-base">
            {{ droitEstime.label }}
          </span>
          <br />
          <span
            class="aj-droit-estime-value font-bold"
            data-testid="droit-estime-value"
          >
            {{ droitEstime.value }}
          </span>
        </span>
        <span
          v-if="droitEstime.legend"
          class="aj-droit-estime-legend"
          data-testid="droit-estime-legend"
        >
          {{ droitEstime.legend }}
        </span>
      </template>
    </div>
    <div class="aj-droit-estime-inattendu">
      <router-link
        v-if="showUnexpected"
        v-analytics="{
          name: droitEstime.label,
          action: 'show-unexpected',
          category: 'General',
        }"
        :to="{ name: 'resultatInattendu', params: { id: droit.id } }"
        >Montant inattendu ?
      </router-link>
    </div>
  </div>
</template>

<script>
import { formatDroitEstime } from "@lib/benefits/details"
import { useStore } from "@/stores"

export default {
  name: "DroitEstime",
  props: {
    droit: Object,
  },
  setup() {
    return {
      store: useStore(),
    }
  },
  computed: {
    droitEstime() {
      return formatDroitEstime(this.droit, this.store.openFiscaParameters)
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
          !this.store.ressourcesYearMinusTwoCaptured) ||
        this.droit.showUnexpectedAmount
      )
    },
  },
}
</script>
<style></style>
