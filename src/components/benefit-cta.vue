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
          <router-link
            id="cta-proximity"
            v-analytics="{
              name: benefit.id,
              action: BehaviourEventTypes.showLocations,
              category: 'General',
            }"
            class="fr-btn"
            :to="{
              name: 'resultatsLieuxDedies',
              params: { benefit_id: benefit.id },
            }"
          >
            À proximité de chez vous
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import BenefitCtaLink from "./benefit-cta-link.vue"
import { hasEtablissements } from "@lib/benefits/etablissements.ts"
import StatisticsMixin from "@/mixins/statistics.ts"

export default {
  name: "BenefitCta",
  components: {
    BenefitCtaLink,
  },
  mixins: [StatisticsMixin],
  props: {
    benefit: Object,
  },
  data: function () {
    return {
      levels: ["success", "default"],
    }
  },
  computed: {
    ctas() {
      const ctaBehaviourTypes = [
        this.BehaviourEventTypes.teleservice,
        this.BehaviourEventTypes.form,
        this.BehaviourEventTypes.instructions,
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
      return hasEtablissements(this.benefit) && this.$route.name !== "aide"
    },
  },
}
</script>
