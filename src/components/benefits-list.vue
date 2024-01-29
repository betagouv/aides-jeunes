<script setup lang="ts">
import { PropType, defineProps } from "vue"
import BenefitsGroupPreview from "@/components/benefits-group-preview.vue"
import { StandardBenefit, StandardBenefitGroup } from "@data/types/benefits"
import BenefitPreview from "@/components/benefit-preview.vue"

const props = defineProps({
  benefitsAndBenefitsGroups: {
    type: Array as PropType<(StandardBenefitGroup | StandardBenefit)[]>,
    required: true,
  },
})

const getComponentType = (benefitAndBenefitsGroup) => {
  return benefitAndBenefitsGroup.benefits
    ? BenefitsGroupPreview
    : BenefitPreview
}
</script>

<template>
  <div
    v-for="(benefitOrBenefitsGroup, index) in props.benefitsAndBenefitsGroups"
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
