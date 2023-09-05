<template>
  <div class="fr-container fr-px-0 fr-mb-0 fr-py-2w">
    <div class="fr-grid-row fr-grid-row--gutters">
      <ul
        v-for="(cta, index) in ctas"
        :key="index"
        class="fr-col-6 fr-btns-group fr-mx-0 fr-py-0 fr-px-0"
      >
        <li>
          <BenefitCtaLink
            :analytics-name="benefit.id"
            :benefit="benefit"
            :link="cta.link"
            :type="cta.type"
            :level="levels[index]"
          /> </li
      ></ul>
      <ul
        v-if="showProximityCta"
        class="fr-col fr-btns-group fr-mx-0 fr-py-0 fr-px-0"
      >
        <li>
          <AnalyticRouterLink
            id="cta-proximity"
            class="fr-btn"
            :analytic-name="benefit.id"
            :analytic-action="eventTypeShowLocations"
            :to="{
              name: 'resultatsLieuxDedies',
              params: { benefitId: benefit.id },
            }"
            >À proximité de chez vous
          </AnalyticRouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import BenefitCtaLink from "./benefit-cta-link.vue"
import { hasLieux } from "@lib/benefits/lieux.js"
import AnalyticRouterLink from "@/components/buttons/analytic-router-link.vue"
import { BehaviourEvent } from "@lib/enums/behaviour-event-types.js"

export default {
  name: "BenefitCta",
  components: {
    BenefitCtaLink,
    AnalyticRouterLink,
  },
  props: {
    benefit: Object,
  },
  data: function () {
    return {
      levels: ["success", "default"],
      eventTypeShowLocations: BehaviourEvent.ShowLocations,
    }
  },
  computed: {
    ctas() {
      const ctaBehaviourTypes = [
        BehaviourEvent.Teleservice,
        BehaviourEvent.Form,
        BehaviourEvent.Instructions,
      ]

      return ctaBehaviourTypes
        .map((type) => {
          const linkGenerator = this.benefit[`${type}Generator`]
          const link = this.benefit[type] || (linkGenerator && linkGenerator())
          return {
            type,
            link,
          }
        })
        .filter(function (item) {
          return item.link
        })
        .slice(0, 2)
    },
    showProximityCta() {
      return hasLieux(this.benefit) && this.$route.name !== "aide"
    },
  },
}
</script>
