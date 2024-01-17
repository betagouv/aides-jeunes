<script setup lang="ts">
import { PropType, defineProps } from "vue"
import BenefitPreview from "@/components/benefit-preview.vue"
import { StandardBenefit } from "@data/types/benefits"

const props = defineProps({
  benefits: {
    type: Array as PropType<StandardBenefit[]>,
    required: true,
  },
})
</script>

<template>
  <BenefitPreview
    v-for="(benefit, index) in props.benefits"
    :key="index"
    class="fr-mb-5w"
    :benefit="benefit"
  />
</template>
