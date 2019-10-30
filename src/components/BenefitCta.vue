<template>
  <div>
    <BenefitCtaLink
      v-for="(cta, index) in ctas"
      v-bind:analytics-name="benefit.label"
      v-bind:benefit="benefit"
      v-bind:link="cta.link"
      v-bind:key="index"
      v-bind:type="cta.type"
      v-bind:level="levels[index]"
    ></BenefitCtaLink>
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
