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

const benefitsGroupList = (benefitsGroup) => benefitsGroup.benefits
const benefitsGroupLabel = (benefitsGroup) => benefitsGroup.label
const benefitsGroupLogoPath = (benefitsGroup) => benefitsGroup.logoPath
const benefitsGroupDescription = (benefitsGroup) => benefitsGroup.description
const benefitsGroupRedirectionPage = (benefitsGroup) =>
  benefitsGroup.redirectionPage
</script>

<template>
  <component
    :is="getComponentType(benefitAndBenefitsGroup)"
    v-for="(benefitAndBenefitsGroup, index) in props.benefitsAndBenefitsGroups"
    :key="index"
    class="fr-mb-5w"
    :benefit="benefitAndBenefitsGroup"
    :benefits="benefitsGroupList(benefitAndBenefitsGroup)"
    :label="benefitsGroupLabel(benefitAndBenefitsGroup)"
    :logo-path="benefitsGroupLogoPath(benefitAndBenefitsGroup)"
    :description="benefitsGroupDescription(benefitAndBenefitsGroup)"
    :redirection-page="benefitsGroupRedirectionPage(benefitAndBenefitsGroup)"
  />
</template>
