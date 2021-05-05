<template>
    <div>
        <BenefitCtaLink
          v-for="(cta, index) in ctas"
          v-bind:key="index"
          v-bind:analytics-name="benefit.label"
          v-bind:benefit="benefit"
          v-bind:link="cta.link"
          v-bind:type="cta.type"
          v-bind:level="levels[index]"
        ></BenefitCtaLink>
        <router-link
            class="button primary"
            v-if="benefit.provider.etablissements && benefit.provider.etablissements.length > 0"
            v-analytics="{ name:benefit.label, action:'show-locations', category:'General'}"
            v-bind:to="{ name: 'resultatsLieuxDedies', params: { benefit_id: benefit.id }}">
            À proximité de chez vous
        </router-link>
    </div>
</template>

<script>
import BenefitCtaLink from './BenefitCtaLink'

const types = ['teleservice', 'form', 'instructions'];
export default {
  name: 'BenefitCta',
  props: {
    benefit: Object,
  },
  components: {
    BenefitCtaLink
  },
  data: function() {
    return {
      levels: ['success', 'default']
    }
  },
  computed: {
    ctas: function() {
      let vm = this;
      return types.map(function(type) {
        return {
          type: type,
          link: vm.benefit[type],
        };
      }).filter(function(item) {
        return item.link;
      }).slice(0, 2)
    },
  },
}
</script>
