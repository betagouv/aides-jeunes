<template>
  <div>
    <BenefitCtaLink
      v-for="(cta, index) in ctas"
      :key="index"
      :analytics-name="benefit.id"
      :benefit="benefit"
      :link="cta.link"
      :type="cta.type"
      :level="levels[index]"
    />
    <router-link
      v-if="showProximityCta"
      id="cta-proximity"
      v-analytics="{
        name: benefit.id,
        action: 'show-locations',
        category: 'General',
      }"
      class="button primary"
      :to="{
        name: 'resultatsLieuxDedies',
        params: { benefit_id: benefit.id },
      }"
    >
      À proximité de chez vous
    </router-link>
  </div>
</template>

<script>
import BenefitCtaLink from "./benefit-cta-link"
import { hasEtablissements } from "@/../lib/benefits/etablissements"

const types = ["teleservice", "form", "instructions"]
export default {
  name: "BenefitCta",
  components: {
    BenefitCtaLink,
  },
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
      let vm = this
      return types
        .map(function (type) {
          return {
            type: type,
            link: vm.benefit[type],
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
