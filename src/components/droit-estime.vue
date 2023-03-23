<template>
  <div
    v-if="
      droit.type &&
      ($route.name !== 'aide' ||
        ($route.name === 'aide' && droit.source === 'javascript'))
    "
    class="aj-benefit-amount"
  >
    <div class="fr-text--center">
      <template v-if="isBenefitTypeNumber || isBenefitTypeString">
        <span>
          {{ droitEstime.label }}
        </span>
        <br />
        <strong class="fr-text--lead" data-testid="droit-estime-value">
          {{ droitEstime.value }} </strong
        >&nbsp;
        <strong
          v-if="droitEstime.legend"
          class="fr-text--lead"
          data-testid="droit-estime-legend"
        >
          {{ droitEstime.legend }}
        </strong>
      </template>
    </div>
    <div class="fr-text--center">
      <router-link
        v-if="showUnexpectedLink"
        v-analytics="{
          name: droit.id,
          action: 'show-unexpected',
          category: 'General',
        }"
        @click="triggerCustomClick"
        :to="{ name: 'resultatInattendu', params: { id: droit.id } }"
        >Montant inattendu ?
      </router-link>
    </div>
  </div>
</template>

<script>
import { formatDroitEstime } from "@lib/benefits/details.ts"
import { useStore } from "@/stores/index.ts"

export default {
  name: "DroitEstime",
  props: {
    droit: Object,
    showUnexpected: {
      type: Boolean,
      default: true,
    },
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
    showUnexpectedLink() {
      return (
        this.showUnexpected &&
        ((this.droit.isBaseRessourcesYearMinusTwo &&
          !this.store.ressourcesYearMinusTwoCaptured) ||
          this.droit.showUnexpectedAmount)
      )
    },
  },
  methods: {
    triggerCustomClick(event) {
      event.target.dispatchEvent(new CustomEvent("custom-click"))
    },
  },
}
</script>
