<script setup lang="ts">
import { PropType, defineProps } from "vue"
import BenefitsGroupPreview from "@/components/benefits-group-preview.vue"
import { StandardBenefit, BenefitGroup } from "@data/types/benefits"
import BenefitPreview from "@/components/benefit-preview.vue"

const props = defineProps({
  benefitsAndBenefitGroups: {
    type: Array as PropType<(BenefitGroup | StandardBenefit)[]>,
    required: true,
  },
})

const getComponentType = (benefitOrBenefitsGroup) => {
  return benefitOrBenefitsGroup.benefits ? BenefitsGroupPreview : BenefitPreview
}
</script>

<template>
  <div
    v-for="(benefitOrBenefitsGroup, index) in props.benefitsAndBenefitGroups"
    :key="index"
    class="fr-mb-5w"
  >
    <component
      :is="getComponentType(benefitOrBenefitsGroup)"
      :benefit="benefitOrBenefitsGroup"
      :group="benefitOrBenefitsGroup"
    />
  </div>
</template>
