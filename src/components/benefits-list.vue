<script setup lang="ts">
import { computed, defineProps } from "vue"
import { StandardBenefit } from "@data/types/benefits"
import BenefitPreview from "@/components/benefit-preview.vue"
import BenefitsMergedPreview from "@/components/benefits-merged-preview.vue"

const props = defineProps({
  benefits: Array<StandardBenefit>,
  filter: Array<any>,
})

const benefitslistFiltered: any = computed(() => {
  return props.benefits?.filter((value: any) => {
    return !props.filter || props.filter.includes(value.id)
  })
})

const bafaBenefits: any = computed(() => benefitslistFiltered.value.filter((benefit: StandardBenefit) => benefit.slug.includes("bafa") === true))
const classicBenefits: any = computed(() => benefitslistFiltered.value.filter((benefit: StandardBenefit) => benefit.slug.includes("bafa") === false))
</script>

<template>
  <div
    v-for="(benefit, index) in classicBenefits"
    :key="index"
    class="fr-mb-5w"
  >
    <BenefitPreview :benefit="benefit" />
  </div>
  <BenefitsMergedPreview
    :benefits="bafaBenefits"
    label="Aides BAFA et BAFD"
    description="Différents organismes peuvent vous aider à financer votre formation BAFA ou BAFD."
    redirection-page="aides-bafa"
  />
</template>
