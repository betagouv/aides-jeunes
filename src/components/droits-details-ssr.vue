<template>
  <div
    class="fr-tile fr-tile-horizontal fr-mb-2w"
    data-testid="droit-detail"
    itemscope
    itemtype="http://schema.org/GovernmentService"
  >
    <div class="fr-p-4w">
      <DroitHeader :droit="droit"></DroitHeader>
      <p class="fr-text--justify fr-mb-3w">
        <span itemprop="description" v-html="droit.description" />
        <span>&nbsp;</span>
        <BenefitCtaLink
          v-if="droit.link"
          :analytics-name="droit.id"
          :benefit="droit"
          :link="droit.link"
          itemprop="termsOfService"
          level="'inline'"
          :type="eventTypeLink"
        />
      </p>
      <div
        v-if="showConditions(droit)"
        class="fr-highlight fr-ml-0 fr-py-2w fr-mb-2w"
      >
        <strong>Pour en bénéficier, vous devez également : </strong>
        <ul
          v-if="showVoluntaryConditions(droit)"
          class="fr-toggle__list fr-px-0"
        >
        </ul>
        <ul v-if="showBaseConditions(droit)" class="fr-toggle__list fr-px-0">
          <li v-for="(condition, index) in droit.conditions" :key="index">
            <img alt="" src="@/assets/images/doigt.svg" class="fr-mr-1w" />
            <span v-html="condition" />
          </li>
        </ul>
      </div>

      <div class="fr-print-hidden">
        <BenefitCta :benefit="droit" class="fr-mt-4w" />
        <div v-if="droit && showDetailsLieux" class="fr-print-hidden">
          <div class="fr-mt-4w">
            <DroitDetailsLieux :benefit="droit" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue"
import BenefitCta from "./benefit-cta.vue"
import BenefitCtaLink from "./benefit-cta-link.vue"
import DroitMixin from "@/mixins/droit-mixin.js"
import DroitHeader from "@/components/droit-header.vue"
import DroitDetailsLieux from "@/components/droits-details-lieux.vue"
import { EventAction } from "@lib/enums/event.js"
import { StandardBenefit } from "@data/types/benefits.d.js"

export default {
  name: "DroitsDetails",
  components: {
    DroitHeader,
    DroitDetailsLieux,
    BenefitCta,
    BenefitCtaLink,
  },
  mixins: [DroitMixin],
  props: {
    droit: {
      type: Object as PropType<StandardBenefit>,
      required: true,
    },
    droits: Array,
  },
  data() {
    return {
      eventTypeMSA: EventAction.Msa,
      eventTypeLink: EventAction.Link,
    }
  },
  computed: {
    showDetailsLieux() {
      return this.$route?.name !== "aide"
    },
    showConditions() {
      return (droit) =>
        droit.conditions?.length || droit.voluntary_conditions?.length
    },
    showBaseConditions() {
      return (droit) => droit.conditions?.length
    },
    showVoluntaryConditions() {
      return (droit) => droit.voluntary_conditions?.length
    },
  },
}
</script>
