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
      <AnalyticRouterLink
        v-if="showUnexpectedLink"
        :analytic-name="droit.id"
        :analytic-action="eventTypeShowUnexpected"
        :to="{ name: 'resultatInattendu', params: { id: droit.id } }"
      >
        Montant inattendu ?
      </AnalyticRouterLink>
    </div>
  </div>
</template>

<script>
import { formatDroitEstime } from "@lib/benefits/details.ts"
import { useStore } from "@/stores/index.ts"
import AnalyticRouterLink from "@/components/buttons/analytic-router-link.vue"
import { BehaviourEventTypes } from "@lib/enums/behaviour-event-types.ts"

export default {
  name: "DroitEstime",
  components: {
    AnalyticRouterLink,
  },
  data() {
    return {
      eventTypeShowUnexpected: BehaviourEventTypes.showUnexpected,
    }
  },
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
}
</script>
